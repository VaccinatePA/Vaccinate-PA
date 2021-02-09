import { createRef } from "react";
import AirTableEmbed from "../components/AirTableEmbed";
import CountySuggestion from "../components/CountySuggestion";
import CountySearch from "../components/CountySearch";
import Layout from "../layouts/Layout";

export default function Index() {
  const countySearchRef = createRef();

  return (
    <Layout title="Vaccine Availability">
      <div className="container-fluid mt-4">
        <h1 className="mt-4 mb-4">
          Pennsylvania COVID-19 Vaccine Availability
        </h1>
        <CountySearch searchRef={countySearchRef} />
        <p className="mt-4">
          We are a volunteer team calling hospitals and pharmacies to identify
          which facilities are currently administering vaccines. This website
          will be updated daily to reflect the latest information we are able to
          gather.
        </p>
        <p>
          Follow us on <a href="https://twitter.com/VaccinatePA">Twitter</a> and
          like us on <a href="https://www.facebook.com/vaccinatepa">Facebook</a>{" "}
          for more information.
        </p>
        <p>
          Interested in volunteering? Please{" "}
          <a href="https://forms.gle/5vyDk2tTjYUTMTXu6">sign up here</a>, and we
          will reach out to you.
        </p>
        <div className="my-4">
          <CountySuggestion searchRef={countySearchRef} />
        </div>
        <h4 className="mt-4">View all county information below:</h4>
        <p className="mt-4 alert alert-secondary text-center">
          <b>
            We appreciate your patience as we are rapidly adding more volunteers
            to help us update information on this site.
          </b>{" "}
          The site will be updated daily as we gather more information. If you
          would like to help volunteer to obtain updated vaccine availability
          information, please{" "}
          <a
            href="https://forms.gle/5vyDk2tTjYUTMTXu6"
            target="_blank"
            rel="noreferrer"
          >
            sign up to volunteer here
          </a>
          .
        </p>
        <p className="mt-2 alert alert-secondary text-center">
          If you have a missing location to report, or think we have incorrect
          information,{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://airtable.com/shr7z01kc7h1ogP5R"
          >
            please let us know.
          </a>
        </p>
        <AirTableEmbed />
      </div>
    </Layout>
  );
}
