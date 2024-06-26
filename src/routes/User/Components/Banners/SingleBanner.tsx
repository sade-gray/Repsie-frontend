import './SingleBanner.css';

const SingleBanner = ({ bannerimage, heading }: { bannerimage: string; heading: string }) => {
  return (
    <div className="singlebanner">
      <div className="bannerimgfilter"></div>
      <img className="bannerimg" src={bannerimage} alt="noimg" />
      <div className="bannerheading">
        <h1>{heading}</h1>
      </div>
    </div>
  );
};

export default SingleBanner;
