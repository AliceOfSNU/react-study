import React, {useState} from 'react'
import { createPortal } from 'react-dom'

function App() {
  return (
    <Visualizer/>
  )
}


//this class caches two maps of sentence-wise scores: 
// 1. autoregressive scores
// 2. input scores
//when user puts cursor in different sentences of <Source>, 
//we update the srcIdx, which in turn re-renders the two <Score> components
//with the scores corresponding to that srcIdx
class Visualizer extends React.Component{

  /********** public fields ***********/

  //input = '해가 진 후에. 귀가했다. 계속 야근해서. 그런지 운동을. 쉬어서 그런지 어깨랑 목이 아팠다'
  //novel = '해는 이미 한참 전에 저물어 사방은 가게들에서 새어 나오는 빛과 거리에 설치된 가로등만이 어둑한 길을 밝혀 주고 있었다. "벌써 해가 지는구나" 새빨갛게 빛나는 해를 얼마나 멍하니 바라보았을까, 그는 문득 목과 어깨가 꽤나 뻐근하단 걸 느꼈다. 그동안 잦은 야근으로 뻣뻣해진 걸까, 그는 가볍게 목을 꺾고 몸을 옆으로 돌리며 가볍게 풀기 시작했다. “끄응…. 몸도 예전 같지가 않네….” 확실히 운동을 제대로 못 해서 그런가. 피곤한 몸이 옛날 같지가 않았다. …물론, 나이를 먹은 탓도 있기야 하겠지만. '
    
  inputScores
  autoRegressiveScores

  /********** constructor ***********/

  constructor(props){
    super(props)
    this.state={
      srcIdx: null,
      input: '해가 진 후에. 귀가했다. 계속 야근해서. 그런지 운동을. 쉬어서 그런지 어깨랑 목이 아팠다',
      novel: '해는 이미 한참 전에 저물어 사방은 가게들에서 새어 나오는 빛과 거리에 설치된 가로등만이 어둑한 길을 밝혀 주고 있었다. "벌써 해가 지는구나" 새빨갛게 빛나는 해를 얼마나 멍하니 바라보았을까, 그는 문득 목과 어깨가 꽤나 뻐근하단 걸 느꼈다. 그동안 잦은 야근으로 뻣뻣해진 걸까, 그는 가볍게 목을 꺾고 몸을 옆으로 돌리며 가볍게 풀기 시작했다. “끄응…. 몸도 예전 같지가 않네….” 확실히 운동을 제대로 못 해서 그런가. 피곤한 몸이 옛날 같지가 않았다. …물론, 나이를 먹은 탓도 있기야 하겠지만. ',
    }
    this.calculateScores()
  }

  /********** helper methods***********/
  calculateScores(){
    
    let inputSplits = this.state.input.split('.')
    let novelSplits = this.state.novel.split('.')

    //inputScores[idx i of sentence in NOVEL]: score of i'th sentence in NOVEL with the ```INPUT```
    this.inputScores =  new Array(novelSplits.length)
    //autoRegressiveScores[idx i of sentence in NOVEL] : score of i'th sentence in NOVEL with the ```NOVEL```
    this.autoRegressiveScores = new Array(novelSplits.length)

    for (let i = 0; i < this.inputScores.length; i++) {
      this.inputScores[i] = Array(inputSplits.length).fill(0)
      for (let j = 0; j < this.inputScores[i].length; j++){
        this.inputScores[i][j] = Math.random()
      }
    }

    for (let i = 0; i < this.autoRegressiveScores.length; i++){
      this.autoRegressiveScores[i] = Array(novelSplits.length).fill(0)
      for (let j = 0; j < this.autoRegressiveScores[i].length; j++){
        this.autoRegressiveScores[i][j] = Math.random()
      }
    }

    console.log("calculating scores again. inputs: " +  inputSplits)
  }

  callAPI() {
    fetch("http://localhost:3001/reactAPI", {
      method: "GET",
    })
        .then(res => res.json())
        .then(res => {
          this.setState({ 
            input: res.input,
            novel: res.novel 
          })          
        })
        .catch(err => console.log(err))
  }
  /********** react methods***********/

  componentDidUpdate(prevProps, prevState) {
    console.log("input changed to" + this.state.input)
    console.log("novel changed to" + this.state.novel)
    this.calculateScores()
  }

  componentWillMount() {
    console.log("will mount")
    this.callAPI();
  }

  render(){
    return(
      <div>
        <p> hyperclova output --------------- </p>
        <Source 
          srcText={this.state.novel}
          onIdxChanged={(i)=>{
            this.setState({srcIdx: i})}
          }
        />
        <Score
          text = {this.state.input}
          scores = {this.state.srcIdx !== null ? this.inputScores[this.state.srcIdx] : null}
        />
        <Score
          text = {this.state.novel}
          scores = {this.state.srcIdx !== null ? this.autoRegressiveScores[this.state.srcIdx] : null}
        />
      </div>
    )
  }
}
class Score extends React.Component{

  splits = []

  constructor(props){
    super(props)
    let splits = props.text.split('.')
    this.state={
      text: props.text, //text to display (ex: input)
    }
    this.splits = splits
  }

  /* can catch when props are updated from parent
  componentDidUpdate(prevProps) {
    if ( prevProps.scores !== this.props.scores){
      console.log("changed scoress" + prevProps.scores + '->' + this.props.scores)
    } 
  }
  */
 
  render(){
    return (
        <div>
          <p> SCORES ------------- </p>
          <div>
            {this.props.text.split('.').map((part, i) => 
              <TargetText
              text={part}  
              i = {i}
              color = {this.props.scores === null ? 0 : this.props.scores[i]}
            />)}
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
    this.setState({
      hoverIdx: i
    })
    this.onIdxChanged(i)
  }
  handleMouseOut = (i)=>{
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
  var col = "#FFFFFF"
  if (props.color < 0.2) {
    col = "#FFFFFF"
  }
  else if (props.color < 0.4){
    col = "#FFDDDD"
  } else if (props.color < 0.6){
    col = "#FFAAAA"
  } else{
    col = "#FF8888"
  }

  return(
  <span> 
      <span 
      key={props.i} 
      style={ 
        { backgroundColor: `${col}`}
      }
      >
        {props.text}
      </span>
    </span>
  )
}
export default App;
