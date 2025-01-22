import PuffLoader from "react-spinners/PuffLoader";

const override = {
    margin: "auto",
};

function LoadingSpinner({ loading }) {

    return (
        <div className="sweet-loading py-48">
            <PuffLoader
                color={"#ffffff"}
                loading={loading}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default LoadingSpinner;