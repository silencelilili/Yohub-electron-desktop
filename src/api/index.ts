import axiosRequest from "./_axios";
import fetchRequest from "./_fetch";
let request: any = null;
if (import.meta.env.MODE === "development") {
  request = axiosRequest;
} else {
  request = fetchRequest;
}
export default request;
