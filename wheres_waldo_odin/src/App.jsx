import { useState,useRef,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
const characters = [{name:'Waldo',coords:[]},{name:'Scooby',coords:[]},{name:'Batman',coords:[]}]
const Box = ({chars,x,y,setSuccess,setFail,setMarker})=>{
  const validateChar = (e,char) => {

    const {name,coords} = char;
    const xCoord = coords[0];
    const yCoord = coords[1];
    console.log(name,xCoord,yCoord,char);
    if(xCoord === x && yCoord === y){
      setSuccess(true);
      setFail(false);
      setMarker(true);
    }else{
      setSuccess(false);
      setFail(true);
      setMarker(false);
    }

  }
  const boxStyle = {
    position:'absolute',
    left:`${x}px`,
    top:`${y}px`,
    width:'100px',
    height: '100px',
    backgroundColor: 'red',
    zIndex:'100000'
  };
  return (
    <div style={boxStyle}>
      <ul>
        {chars.map((char,index)=><li onClick={(e)=>validateChar(e,char)} key={index}>{char.name}</li>)}
      </ul>
    </div>
  )
};


// }when user select char after clicking check if the char's coords are the same as that box
// if no match throw msg
// if correct when box removed put marker where box was
function App() {
  const [beginTime, setBeginTime] = useState(new Date())
  const [xCoord,setXCoord] = useState(0);
  const [yCoord,setYCoord] = useState(0);
  const [active,setActive] = useState(false);
  const [success,setSuccess] = useState(false);
  const [fail,setFail] = useState(false);
  const [showMarker,setMarker] = useState(false);
  const [chars,setChars] = useState([{name:'Waldo',coords:[]},{name:'Scooby',coords:[]},{name:'Batman',coords:[]}]);
  const [showChar,setShowCar] = useState(true);
  useEffect(() => {

    const updatedChars = characters.map(char=>{
      const randomXCoord = Math.floor(Math.random() * (window.innerWidth - 100));
      const randomYCoord = Math.floor(Math.random() * (window.innerHeight - 100))


    return {
      ...char,
      coords:[randomXCoord,randomYCoord]
    }});
    console.log('characters',updatedChars)
    setChars(updatedChars);
  },[]);


  const toggleBox = (e) => {
    const x = event.clientX;
    const y = event.clientY;
    if(active){
      setXCoord(null);
      setYCoord(null);
      setActive(false);
    }else{
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
        showMarker?(<div className = "marker"></div>):(<div style={{display:'none',left:`${xCoord}px`,top:`${yCoord}px`,width:'10px',height: '20px',backgroundColor:'black',position:'absolute'}} className = "marker"></div>)
      }
      {
        showChar?(
          chars.map(char=>{
            const x = char.coords[0];
            const y = char.coords[1];
            return <div style={{zIndex:'9999',left:`${x}px`,top:`${y}px`,width:'70px',height: '50px',backgroundColor:'orange',position:'absolute'}} className={char.name}>{char.name}</div>
          })
        ):(<div style={{display:'none'}}></div>)
      }


      <img onClick = {(e)=>toggleBox(e)}  className = "photo" src="crowd.avif" alt="Crowd" />
      {active && <Box setMarker={setMarker} setFail={setFail} setSuccess={setSuccess} chars = {chars} x = {xCoord} y = {yCoord}/>}

    </>
  )
}

export default App
