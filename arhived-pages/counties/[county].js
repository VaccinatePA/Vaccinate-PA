import { useState } from "react";
import counties from "../../content/counties";
import { StandardLocationGroups } from "../../components/LocationGroups";
import Layout from "../../layouts/Layout";
import { getCountyLocations, getCountyLinks } from "../../utils/Data";
import { getCounty } from "../../realtime-api/realtimeData";
import { FaArrowLeft, FaRegClock } from "react-icons/fa";
import moment from "moment";
import Link from "next/link";
import TranslationOptions from "../../components/TranslationOptions";
import RealtimeLocations from "../../components/RealtimeLocations";
import { Button } from "react-bootstrap";
import DataAnnouncements from "../../components/DataAnnouncements";
import CountyInfoLinks from "../../components/CountyInfoLinks";
import ArchiveNotice from "../../components/ArchiveNotice";

function countyToCountyCode(county) {
  return county.split(" ")[0].toLowerCase();
}

function titleCase(str) {
  return str.replace(/(^|\s)\S/g, function (t) {
    return t.toUpperCase();
  });
}

function LatestReportsReceived({
  latestRealtimeReport,
  latestReportedLocation,
}) {
  if (latestReportedLocation) {
    let latestReportTime = moment(
      latestReportedLocation.fields["Latest report"]
    );

    if (latestRealtimeReport) {
      const latestRealtimeReportTime = moment(latestRealtimeReport);
      if (latestRealtimeReportTime.isAfter(latestReportTime)) {
        latestReportTime = latestRealtimeReportTime;
      }
    }

    return (
      <span
        className="badge badge-primary font-weight-normal text-wrap"
        style={{ fontSize: "100%" }}
      >
        <FaRegClock size="1.00em" />{" "}
        <span className="align-middle">
          Latest county report received {latestReportTime.fromNow()}
        </span>
      </span>
    );
  }

  return null;
}

export default function CountyPage({
  county,
  countyLinks,
  locations,
  realtimeLocations,
  realtimeLocationsUpdated,
  error,
}) {
  // This might be smelly. Using to avoid spilling realtime data
  // fetching into an otherwise SSR component.
  const [latestRealtimeReport, setLatestRealtimeReport] = useState(null);

  if (error) {
    return (
      <Layout
        title={county + " Vaccine Availability"}
        description={`Find Vaccine Availability in ${county}, PA and other counties`}
      >
        <div className="text-center">
          <h1 className="mt-5">We are currently experiencing an outage.</h1>
          <p>This normally only lasts a few minutes. Please check back soon!</p>
          <Link href="/">
            <Button variant="warning" className="rounded-pill my-2">
              Go Back Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const shareURL = `https://vaccinatepa.org/counties/${county.replace(
    " ",
    "_"
  )}`;

  const sharethisConfig = {
    alignment: "center",
    labels: "cta",
    color: "white",
    enabled: true,
    networks: ["facebook", "twitter", "reddit", "email", "sms"],
    radius: 4,
    size: 32,
    description: `${county} COVID-19 Vaccine Availability`,
    subject: "VaccinatePA: Find COVID-19 Vaccine Availability",
    message: `Find ${county} and more COVID-19 vaccine availability here: ${shareURL}`,
    username: "VaccinatePA",
    url: shareURL,
  };

  const latestReportedLocation =
    locations.allLocations.length > 0 ? locations.allLocations[0] : null;

  return (
    <Layout
      title={county + " Vaccine Availability"}
      description={`Find Vaccine Availability in ${county} and others`}
    >
      <div className="container-fluid container-xl mt-3">
        <div className="ml-1 mb-2">
          <Link href="/">
            <a>
              <FaArrowLeft />{" "}
              <span className="align-middle">View all counties</span>
            </a>
          </Link>
          <div className="float-right">
            <TranslationOptions />
          </div>
        </div>
        <h1 className="mb-3 d-none d-sm-block">
          {county} COVID-19 Vaccine Availability
        </h1>
        <h2 className="mb-3 d-block d-sm-none">
          {county} COVID-19 Vaccine Availability
        </h2>
        <div className="mb-4 row justify-content-between">
          <div className="col-12 col-md-auto">
            <LatestReportsReceived
              latestRealtimeReport={latestRealtimeReport}
              latestReportedLocation={latestReportedLocation}
            />
          </div>
          <div className="col-12 col-md-auto text-md-right mt-2 mt-md-0">
            <CountyInfoLinks countyLinks={countyLinks} />
          </div>
        </div>
        <DataAnnouncements sharethisConfig={sharethisConfig} />
        <RealtimeLocations
          updateLatestReportTime={(latestRealtimeReport) =>
            setLatestRealtimeReport(latestRealtimeReport)
          }
          apiURL={`/api/realtime/counties/${countyToCountyCode(county)}`}
          locations={realtimeLocations}
          lastUpdated={realtimeLocationsUpdated}
        />
        <ArchiveNotice />
        <div className="d-flex flex-column">
          {locations.allLocations.length <= 0 ? (
            <>
              <h2 className="text-center mt-5">
                We currently have no locations for {county} on record.
              </h2>
              <h2 className="text-center">
                You can view all counties <Link href="/">here</Link>.
              </h2>
            </>
          ) : null}
          <StandardLocationGroups locations={locations} />
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const countyDecoded = titleCase(params.county.replace("_", " "));
  if (!counties.includes(countyDecoded)) {
    return {
      notFound: true,
    };
  }

  try {
    var [countyLocations, realtimeLocations, countyLinks] = await Promise.all([
      getCountyLocations(countyDecoded),
      getCounty(countyToCountyCode(countyDecoded)),
      getCountyLinks(countyDecoded),
    ]);
  } catch (error) {
    console.error(error);
    return {
      props: {
        county: countyDecoded,
        error: true,
      },
    };
  }

  return {
    props: {
      county: countyDecoded,
      countyLinks: countyLinks,
      locations: countyLocations,
      realtimeLocations,
      realtimeLocationsUpdated: new Date().toISOString(),
    },
  };
}
