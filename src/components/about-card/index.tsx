const AboutCard = () => {
  return (
    <div className="card shadow-lg compact bg-base-100 z-hover">
      <div className="card-body">
        <div className="mx-3 mb-2">
          <h5 className="card-title">
            <span className="text-base-content opacity-70">About Me</span>
          </h5>
        </div>
        <div className="text-base-content text-opacity-60 px-3 text-sm">
          <p className="mb-3">
            Infrastructure-focused IT Systems Administrator with demonstrated
            expertise in Linux system administration, virtualization, and
            automation across different technical environments. Professional
            experience encompasses end-user support and IT asset management,
            complemented by interdisciplinary academic degrees that include a
            Master's degree in IT Management from Webster University and a
            Master of Arts in Applied Linguistics and ELT from Jahangirnagar
            University.
          </p>
          <p>
            Research and professional interests center on infrastructure
            optimization, cloud computing, containerization, cybersecurity, and
            the application of large language models to emerging technology
            challenges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutCard;
