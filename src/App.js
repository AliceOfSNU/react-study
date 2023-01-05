import React, {useState} from 'react'
import { createPortal } from 'react-dom'

function App() {

  return (
    <Score/>
  )
}
class Score extends React.Component{

  novel = '해는 이미 한참 전에 저물어 사방은 가게들에서 새어 나오는 빛과 거리에 설치된 가로등만이 어둑한 길을 밝혀 주고 있었다. "벌써 해가 지는구나" 새빨갛게 빛나는 해를 얼마나 멍하니 바라보았을까, 그는 문득 목과 어깨가 꽤나 뻐근하단 걸 느꼈다. 그동안 잦은 야근으로 뻣뻣해진 걸까, 그는 가볍게 목을 꺾고 몸을 옆으로 돌리며 가볍게 풀기 시작했다. “끄응…. 몸도 예전 같지가 않네….” 확실히 운동을 제대로 못 해서 그런가. 피곤한 몸이 옛날 같지가 않았다. …물론, 나이를 먹은 탓도 있기야 하겠지만. '
  userText = '해가 진 후에. 귀가했다. 계속 야근해서. 그런지 운동을. 쉬어서 그런지 어깨랑 목이 아팠다'
  splits = []

  constructor(props){
    super(props)
    this.state={
      idx : null,
      scores : null,
    }
  }

  calculateSBERT(srcidx) {
    this.splits = this.userText.split('.')
    const scores = Array(this.splits.length).fill(0)
    scores[0] = Math.random()
    scores[1] = Math.random()
    scores[2] = Math.random()
    scores[3] = Math.random()
    scores[4] = Math.random()
    this.setState({scores: scores})
    console.log("scores: " + this.state.scores)
  }

  render(){
    return (
      <div>
        <p> hyperclova output --------------- </p>
          <Source 
            srcText={this.novel}
            onIdxChanged={(i)=>{this.calculateSBERT(i)}}
          />
        <div>
          <p> user input ------------- </p>
          <div>
            {this.splits.map((part, i) => 
              <TargetText
              text={part}  
              i = {i}
              color = {this.state.scores[i]}
            />)}
          </div>
        </div>
      </div>
    )
  }
}
class Source extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      srcText: props.srcText,
      parts: props.srcText.split('.'),
      hoverIdx: 0,
    }
    this.onIdxChanged = props.onIdxChanged
  }

  handleMouseOver = (i)=>{
    console.log(`over${i}!`)
    this.setState({
      hoverIdx: i
    })
    this.onIdxChanged(i)
  }
  handleMouseOut = (i)=>{
    console.log(`out${i}!`)
    this.setState({
      hoverIdx: null
    })
    this.onIdxChanged(null)
  }


  render(){
    return(
      <div>
          {this.state.parts.map((part, i) => 
            <SourceText
            part={part}  
            i = {i}
            isHoveringText = {this.state.hoverIdx === i}
            hoverEnter =  {this.handleMouseOver}
            hoverExit =  {this.handleMouseOut} 
          />)}
      </div>
    )
  }
}

function SourceText(props){
  return (
    <span>
      <span 
        key={props.i} 
        onMouseOver={()=> {
          props.hoverEnter(props.i)
        }}
        onMouseOut ={()=>{
          props.hoverExit(props.i)
        }}
        style={props.isHoveringText ? { fontWeight: 'bold' } : {} }
        >
          { props.part + '.' }
      </span>
    </span>
  )
}

/*
class AnnotatedText extends React.Component{
  constructor(props){
    super(props)
    this.text = props.text
    this.splits = props.text.split('.')
  }
  render(){
    return (
      <div>
        {this.splits.map((part, i) => 
          <TargetText
          text={part}  
          i = {i}
          red = {false}
        />)}
      </div>
    )
  }
}
*/

function TargetText(props){
  var col = "#000000"
  if (props.color < 0.4){
    col = "#441111"
  } else if (props.color < 0.6){
    col = "#BB3333"
  } else{
    col = "#FF0000"
  }

  return(
  <span> 
      <span 
      key={props.i} 
      style={ 
        { color: `${col}`}
      }
      >
        {props.text}
      </span>
    </span>
  )
}
export default App;
