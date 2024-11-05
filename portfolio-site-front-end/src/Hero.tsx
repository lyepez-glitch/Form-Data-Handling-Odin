import {useState} from 'react';

function Hero(){
  const [name,setName] = useState<string>('Lucas Yepez');
  const [title,setTitle] = useState<string>('FullStack Developer');
  const [intro,setIntro] = useState<string>('Hi I am a software engineer');

  return (
    <>
    <div className="userContainer">
    <div style={{ marginBottom: '20px', display: 'block' }}>
    <h3 style={{ margin: 0 ,display:'block'}}>Name:</h3>
    <div>{name}</div>
    </div>
      <h3>Title: {title}</h3>
      <p>Intro: {intro} </p>
    </div>

    </>
  )
}
export default Hero;