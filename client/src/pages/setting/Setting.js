import RouteMessages from "../../components/RouteMessages/RouteMessages";
import Navbar from "../../components/navbar/Navbar";

const Setting = () => {
  return (
    <>
      <Navbar path={"/chatInterface"} page={"Chat Page"} />
      <div className="Setting">
        <RouteMessages />
      </div>
    </>
  );
};
export default Setting;
