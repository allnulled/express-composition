const fs = require("fs-extra");
const exec = require("execute-command-sync");
const path = require("path");
const http = require("http");
const https = require("https");
const Controller = require(__dirname + "/Controller.js");
const Composable = require(__dirname + "/Composable.js");

/**
 * 
 * ----------------------
 * 
 * ## `AppComposer`
 * @type *Class. Function.*
 * @extends `Composable`
 * @description Useful to compose `express` applications from `express-composition` controllers.
 * 
 */
class AppComposer extends Composable {

    static get DEFAULT_SECURE_SERVER() {
        return {
            secureServer: false,
            secureServerOptions: {},
        };
    }

    static get DEFAULT_SECURE_SERVER_OPTIONS() {
        const keyFile = "key.pem";
        const csrFile = "csr.pem";
        const certificateFile = "cert.pem";
        return {
            generateCertificates: true,
            generateCertificatesCommand: `openssl genrsa -out ${keyFile}
openssl req -new -key ${keyFile} -out ${csrFile} -subj "/C=ES/ST=Catalonia/L=Barcelona/O=FSociety/OU=IT/CN=example.com//emailAddress=webmaster@example.com"
openssl x509 -req -days 9999 -in ${csrFile} -signkey key.pem -out ${certificateFile}`,
            certificatesFolder: path.resolve(process.cwd(), "security/certificates/server"),
            keyFile,
            csrFile,
            certificateFile,
        }
    }

    /**
     * 
     * ----------------------------
     * 
     * ### `AppComposer.compose`
     * @type *Static class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application object from `express` framework.
     * @parameter - `controllers:Array<Object>`. List of `Controller` objects from `express-composition` framework.
     * @returns `application:Promise<Object>`. Asynchronously, the `express` application already composed, with all `express-composition` controllers attached.
     * @description Creates an `AppComposer` object, and returns the `appComposer.compose` method result.
     */
    static compose(...args) {
        const appComposer = new this();
        return appComposer.compose(...args);
    }
    
    static createServers(...args) {
        const appComposer = new this();
        return appComposer.createServers(...args);
    }

    /**
     * 
     * ------------------------------
     * 
     * ### `appComposer.constructor`
     * @type *Class constructor. Function.*
     * @parameter
     * @parameter - `Object:options`. Properties and methods that should be implemented by the instances that this class produces.
     * @description Creates an `AppComposer` instance.
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * 
     * -------------------------------
     * 
     * ### `appComposer.compose`
     * @type *Class method. Function.*
     * @parameter 
     * @parameter - `application:Object`. Application of `express` framework into which the controllers will be mounted.
     * @parameter - `controllers:Array<Controller>`. List of `express-composition` controllers to be mounted into an `express` application.
     * @returns `application:Promise<Object>`. Asynchronously, the `express` application with all the `express-composition` controllers mounted on it.
     * @description Composes and returns asynchronously an `express` application from `express-composition` controllers.
     */
    async compose(application, controllers, options = {}) {
        try {
            for (let index = 0; index < controllers.length; index++) {
                const controller = controllers[index];
                if (!(controller instanceof Controller)) {
                    throw new Error("[express-composition][AppComposer.compose] Argument 2 must be an array of express-composition.Controller instances, but item " + index + " is not (" + typeof controller + ")");
                } else {
                    const mountingResult = controller.onMount(application);
                    if (mountingResult instanceof Promise) {
                        await mountingResult;
                    }
                }
            }
            return application;
        } catch (error) {
            throw error;
        }
    }

    async createServers(application, controllers, options = {}) {
        try {
            const results = [];
            const app = await this.compose(application, controllers, options);
            results.push(app);
            console.log("[express-composition] Created app.");
            const server = http.createServer(app);
            results.push(server);
            console.log("[express-composition] Created unsecure server.");
            if(options.secureServer) {
                const secureServer = this.createSecureServer(app, options);
                results.push(secureServer);
                console.log("[express-composition] Created secure server.");
            }
            return results;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    createSecureServer(app, options = {}) {
        const secureServerOptions = Object.assign({}, this.constructor.DEFAULT_SECURE_SERVER_OPTIONS, options.secureServerOptions || {});
        const { generateCertificates, generateCertificatesCommand, certificatesFolder, keyFile, certificateFile } = secureServerOptions;
        if(generateCertificates) {
            console.log("[express-composition] Generating certificates.");
            fs.ensureDirSync(certificatesFolder);
            const _keyfile = path.resolve(certificatesFolder, keyFile);
            const _certificatefile = path.resolve(certificatesFolder, certificateFile);
            const hasFiles = fs.existsSync(_keyfile) && fs.existsSync(_certificatefile);
            if(!hasFiles) {
                console.log("[express-composition] Certificate files do not exist. Generating files...");
                try {
                    generateCertificatesCommand.split("\n").forEach(line => {
                        exec(line, {
                            cwd: certificatesFolder
                        });
                    });
                } catch(error) {
                    console.log("[express-composition] Errors generating certificates for secure server:", error);
                }
            } else {
                console.log("[express-composition] Certificate files already exist. Not generated.");
            }
            secureServerOptions.key = fs.readFileSync(_keyfile);
            secureServerOptions.cert = fs.readFileSync(_certificatefile);
        } else {
            console.log("[express-composition] Not generating certificates.");
        }
        return https.createServer(secureServerOptions, app);
    }

}

module.exports = AppComposer;