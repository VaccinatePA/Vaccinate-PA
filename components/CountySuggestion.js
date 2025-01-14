import { useCallback } from "react";
import Link from "next/link";
import CountyLink from "./CountyLink";

const FindMyCounty = ({ searchRef }) => {
  const onClick = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchRef]);

  return (
    <>
      <a
        onClick={onClick}
        className="find-county-button text-white d-block rounded py-2 px-3 mb-3 text-decoration-none user-select-none"
      >
        Find my county or ZIP
      </a>
      <style jsx>{`
        .find-county-button {
          background #1F2937;
          box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 20px 2px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default function CountySuggestion({ searchRef }) {
  return (
    <div className="county-suggestions px-3 px-sm-5 py-4">
      <div className="container">
        <div className="mx-md-n5 row justify-content-center">
          <div className="col-12 col-md-7">
            <h4>Click your county to view vaccine locations</h4>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-4 text-truncate">
                <CountyLink county="Philadelphia County" />
                <CountyLink county="Allegheny County" />
                <CountyLink county="Montgomery County" />
                <CountyLink county="Bucks County" />
              </div>
              <div className="col-lg-6 d-block d-xl-none text-truncate">
                <div className="d-none d-md-block">
                  <CountyLink county="Delaware County" />
                  <CountyLink county="Lancaster County" />
                  <CountyLink county="Chester County" />
                </div>
                <FindMyCounty searchRef={searchRef} />
              </div>
              {/* Additional column for wider displays. */}
              <div className="col-lg-6 col-xl-4 d-none d-xl-block text-truncate">
                <CountyLink county="Delaware County" />
                <CountyLink county="Lancaster County" />
                <CountyLink county="Chester County" />
                <CountyLink county="York County" />
              </div>
              <div className="col-lg-6 col-xl-4 d-none d-xl-block text-truncate">
                <CountyLink county="Berks County" />
                <CountyLink county="Westmoreland County" />
                <CountyLink county="Lehigh County" />
                <FindMyCounty searchRef={searchRef} />
              </div>
            </div>
          </div>
          <div className="mt-3 mt-md-0 col-md-5">
            <h4 className="mb-3">Information about vaccine eligibility</h4>
            <p>
              All Pennsylvanians aged 16 and older are now eligible for the
              COVID-19 vaccine. More information from the Pennsylvania
              Deptartment of Health is available{" "}
              <a
                href="https://www.health.pa.gov/topics/disease/coronavirus/Vaccine/Pages/Vaccine.aspx"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              and for Philadelphia County{" "}
              <a
                href="https://www.phila.gov/programs/coronavirus-disease-2019-covid-19/data/vaccine/"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              .
            </p>
            <p>
              <Link href="/about-us">About VaccinatePA →</Link>
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .county-suggestions {
          background-color: #fcd34d;
        }
      `}</style>
    </div>
  );
}
