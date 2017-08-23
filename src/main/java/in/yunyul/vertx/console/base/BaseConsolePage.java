package in.yunyul.vertx.console.base;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;

class BaseConsolePage implements ConsolePage {
    @Override
    public void mount(Vertx vertx, Router router, String basePath) {
        // Nothing to mount
    }

    @Override
    public String getLoaderFileName() {
        return "/js/base.js";
    }
}
