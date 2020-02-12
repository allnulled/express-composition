const { Controller } = require(__dirname + "/../src/index.js");
class MyController extends Controller {
    onMount(application) {
        application[this.method](this.route, this.middleware, function(request, response, next) {
            response.send("This is a custom controller");
        });
    }
}
const myController = new MyController();