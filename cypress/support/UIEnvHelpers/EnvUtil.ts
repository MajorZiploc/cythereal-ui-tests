import { IEnvHelper } from "./IEnvHelper";
import { LiveEnv } from "./LiveEnv";
import { LocalEnv } from "./LocalEnv";

class EnvUtil {
  chooseEnvHelper(env: string): IEnvHelper {
    if (env === "local") {
      return new LocalEnv();
    } else {
      return new LiveEnv();
    }
  }
}

export const envUtil: EnvUtil = new EnvUtil();
