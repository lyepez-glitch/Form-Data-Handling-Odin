import { useState,useRef,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Box = ({chars,x,y,setSuccess,setFail,setMarker,xClicked,yClicked,setScore,score})=>{

  const validateChar = (e,char,xClicked,yClicked) => {

    const {name,xcoord,ycoord} = char;

    console.log(name,xcoord,ycoord,char);
    const postData = {
      charActual: {clientWidth:xcoord,clientHeight:ycoord},
      cursorClick: {clientWidth:xClicked,clientHeight:yClicked}
    }
    const response = await fetch('http://localhost:3000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    console.log('response',response);
    if(response.within){
      setSuccess(true);
      setFail(false);
      setMarker(true);
      const currScore = score + 1;
      setScore(currScore);

    }else{
      setSuccess(false);
      setFail(true);
      setMarker(false);
    }

  }
  const boxStyle = {
    position:'absolute',
    left:`${x +150}px`,
    top:`${y-20}px`,
    width:'100px',
    height: '100px',
    backgroundColor: 'red',
    zIndex:'100000'

  };
  return (
    <div style={boxStyle}>
      <ul>
        {chars.map((char,index)=><li onClick={(e)=>validateChar(e,char,xClicked,yClicked)} key={index}>{char.name}</li>)}
      </ul>
    </div>
  )
};



function App() {
  const [beginTime, setBeginTime] = useState(new Date())
  const [endTime, setEndTime] = useState(null)
  const [xCoord,setXCoord] = useState(0);
  const [yCoord,setYCoord] = useState(0);
  const [active,setActive] = useState(false);
  const [success,setSuccess] = useState(false);
  const [fail,setFail] = useState(false);
  const [showMarker,setMarker] = useState(false);
  const [xClicked,setxClicked] = useState(null);
  const [score,setScore] = useState(0);
  const [yClicked,setyClicked] = useState(null);
  const [user,setUser] = useState(null);
  const [chars,setChars] = useState([{name:'Waldo',xcoord:null,ycoord:null},{name:'Scooby',xcoord:null,ycoord:null},{name:'Batman',xcoord:null,ycoord:null}]);
  const [showChar,setShowChar] = useState(true);
  useEffect(() => {
    const fetchedChars = async () => {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;
      const url = `http://localhost:3000/chars?innerWidth=${innerWidth}&innerHeight=${innerHeight}`;
      const response = await fetch(url);
      const json = await response.json();
      console.log('json',json)
      setChars(json.foundChars);
    }
    fetchedChars();
    console.log('characters',fetchedChars)

  },[]);

  const handleSubmit = async (event) =>{
    event.preventDefault();
    const response = await fetch('/users',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        body: JSON.stringify({name})
      },
    })
    const result = await response.json();
    setUser(result)

  }
  const toggleBox = (e) => {
    const x = event.clientX;
    const y = event.clientY;
    console.log('96 x',x,y)
    if(active){
      setXCoord(null);
      setYCoord(null);
      setActive(false);
      setxClicked(x)
      setyClicked(y)
    }else{
      setxClicked(x)
      setyClicked(y)
      setXCoord(x);
      setYCoord(y);
      setActive(true);
    }



  }




  return (
    <>
     {
       success? (<div >You've found a character!</div>):(<div style={{display:'none'}} >You've found a character!</div>)
     }
     {
       fail? (<div >Nice try! That's not correct</div>):(<div style={{display:'none'}} >Nice try! That's not correct</div>)
     }
     {
       score === chars.length? (<div >Congratulations, you found all characters! You best score is {endTime - beginTime} ms</div>):(<div style={{display:'none'}} >Congratulations, you found all characters!</div>)

     }
     {
       score === chars.length && !user?:
       (
        <form onSubmit={handleSubmit} action="/users" method="post" class="form-example">

          <label for="name">Enter your name: </label>
          <input type="text" name="name" id="name" required />


        <div class="form-example">
          <input type="submit" value="Subscribe!" />
        </div>
      </form>
       ):(<div style={{display:'none'}}></div>)
     }

      {
        showMarker?(<div className = "marker"></div>):(<div style={{display:'none',left:`${xCoord}px`,top:`${yCoord}px`,width:'10px',height: '20px',backgroundColor:'black',position:'absolute'}} className = "marker"></div>)
      }
      {
        showChar?(
          chars.map(char=>{
            const x = char.xcoord];
            const y = char.ycoord;
            return <div style={{zIndex:'9999',left:`${x}vw`,top:`${y}vh`,width:'100px',height: '100px',backgroundColor:'orange',position:'absolute'}} className={char.name}>{char.name}</div>
          })
        ):(<div style={{display:'none'}}></div>)
      }


      <img onClick = {(e)=>toggleBox(e)}  className = "photo" src="crowd.avif" alt="Crowd" />
      {active && <Box score = {score} setScore={setScore}yClicked={yClicked} xClicked={xClicked} setMarker={setMarker} setFail={setFail} setSuccess={setSuccess} chars = {chars} x = {xCoord} y = {yCoord}/>}

    </>
  )
}

export default App
