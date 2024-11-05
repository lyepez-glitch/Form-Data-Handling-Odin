import {useState} from 'react';
import { FaReact,FaNode, FaJava, FaPython, FaDatabase } from "react-icons/fa";
import { DiJavascript1, DiJqueryLogo, DiDjango, DiMysql, DiPostgresql, DiMongodb } from 'react-icons/di';
import { SiSpringboot, SiOracle } from 'react-icons/si';
import { FaCertificate } from 'react-icons/fa';
function About(){
  type ProjectType = {
    title:string
  }

  const [bio,setBio] = useState<string>("Hi, I'm Lucas Yepez, a passionate Full Stack Developer with a love for creating intuitive and efficient web applications. With a background in both front-end and back-end technologies, I enjoy working on projects that challenge me to solve complex problems and deliver seamless user experiences. I am constantly learning new tools and frameworks to stay at the cutting edge of web development.When I'm not coding, you can find me exploring the latest tech trends, diving into creative side projects, or collaborating with like-minded developers. My goal is to build solutions that make an impact and help people in meaningful ways.Let's connect and create something amazing together!")

  const [certs, setCerts] = useState([
    { title: 'FreeCodeCamp JavaScript Certification' },
    { title: 'The Odin Project Full Stack JavaScript' },
    { title: 'Associate Degree in Programming' },
  ]);
  const [backgrounds, setBackgrounds] = useState<string[]>([
    "Associate's Degree in Programming from [Your College Name]",
    "Junior Developer at [Company Name] (Month Year - Month Year)",
    "Proficient in JavaScript, Python, React, and Node.js",
    "Certifications: FreeCodeCamp Responsive Web Design, The Odin Project Full Stack JavaScript",
    "Passionate about open-source contributions and community building"
  ]);
  return (
    <>
    <div className="aboutContainer">
      <h3>About:</h3>
      <p>{bio}</p>
      <ul>
        <li><FaReact /> React</li>
        <li><DiJavascript1 /> JavaScript</li>
        <li><FaNode /> Node.js</li>
        <li><DiJqueryLogo /> jQuery</li>
        <li><SiSpringboot /> Spring Boot</li>
        <li><DiDjango /> Django</li>
        <li><FaJava /> Java</li>
        <li><FaPython /> Python</li>
        <li><DiMysql /> MySQL</li>
        <li><DiPostgresql /> PostgreSQL</li>
        <li><SiOracle /> Oracle</li>

        <li><DiMongodb /> MongoDB</li>
    </ul>
    <ul>
      <li style={{ fontWeight: 'bold' }}>Certifications:</li>
      {
        certs.map(cert => (
          <li key={cert.title} style={{ marginBottom: '10px' }}>
            <FaCertificate /> {cert.title}
          </li>
        ))
      }
  </ul>
      <ul>
        Background:
        {
          backgrounds.map(background=>
            <li>{background}</li>
            )
        }
      </ul>

      </div>

    </>
  )
}
export default About;