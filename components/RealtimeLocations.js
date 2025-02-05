import { Component } from "react";
import moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";
import { ImSpinner2 } from "react-icons/im";
import RealtimeLocationCard from "./RealtimeLocationCard";
import Link from "next/link";

const DEFAULT_REFRESH_TIME = 60000; // One minute

export default class RealtimeLocations extends Component {
  constructor(props) {
    super(props);

    const { lastUpdated, locations } = props;
    if (lastUpdated && locations) {
      this.state = {
        lastUpdated,
        locations,
      };

      if (locations.length > 0) {
        this.props.updateLatestReportTime(
          locations[0].properties?.appointments_last_fetched
        );
      }
    } else {
      this.state = {
        lastUpdated: null,
        locations: [],
      };
    }
  }

  componentDidMount() {
    /**
     * Controller used to abort fetch requests if the React component is
     * unmounted during a request:
     * https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
     */
    this.abortController = new AbortController();

    if (!this.props.lastUpdated) {
      // Only immediately fetch if locations haven't been fetched beforehand.
      this.fetchUpdatedLocations();
    }

    this.reloadInterval = setInterval(
      this.fetchUpdatedLocations.bind(this),
      this.props.refreshSeconds
        ? this.props.refreshSeconds * 1000
        : DEFAULT_REFRESH_TIME
    );
  }

  componentWillUnmount() {
    // Abort ongoing fetch requests if there are any.
    this.abortController.abort();
    clearInterval(this.reloadInterval);
  }

  fetchUpdatedLocations() {
    fetch(this.props.apiURL, {
      signal: this.abortController.signal,
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp?.locations) {
          const updateTime = new Date().toISOString();
          this.setState({
            lastUpdated: updateTime,
            locations: resp.locations,
          });

          if (resp.locations.length > 0) {
            this.props.updateLatestReportTime(
              resp.locations[0].properties?.appointments_last_fetched
            );
          }
        }
      })
      .catch((err) => {}); // TODO : Consider implications of failed request.
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.apiURL !== this.props.apiURL) {
      this.fetchUpdatedLocations();
    }
  }

  render() {
    const { lastUpdated, locations } = this.state;

    if (!lastUpdated) {
      return (
        <div className="text-center my-2">
          <BeatLoader size="0.5em" /> Loading Real-time Data...
        </div>
      );
    }

    return (
      <div className={locations.length <= 0 ? "mb-0" : "mb-2"}>
        <h3 className="font-weight-normal mb-0">
          <u>Real-time availability:</u>
        </h3>
        <p className="mb-2" style={{ lineHeight: "100%", marginTop: "4px" }}>
          <small>
            Real-time availability is updated every minute.{" "}
            <Link href="/about-us#where-does-real-time-availability-information-come-from-">
              Learn more
            </Link>
          </small>
        </p>
        <div className="d-flex flex-row">
          <div>
            <ImSpinner2 className="rotating" />
          </div>
          <div className="ml-1" style={{ fontSize: "110%" }}>
            Last {locations.length <= 0 ? "checked" : "updated"}{" "}
            {moment(lastUpdated).format("h:mma")}
          </div>
        </div>
        {locations.map((location) => (
          <div key={location.properties.id} className="my-3">
            <RealtimeLocationCard location={location} />
          </div>
        ))}
      </div>
    );
  }
}
