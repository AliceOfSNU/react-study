express = require('express')
path = require('path')
nunjucks = require('nunjucks')
url = require('url')

//const __filename = url.fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
__dirname = path.resolve(__dirname, '..')
console.log('__dirname: ', __dirname);

const app = express()


nunjucks.configure('public/build', {
    express: app,
    watch: true,
})

app.set('port', process.env.PORT || 3001)
app.set('view engine', 'html') 

app.use(express.json())
app.use(express.urlencoded({extended: false}))
const root = path.join(__dirname, 'build')
app.use(express.static(root))

app.get('/', (req, res) => {
    res.sendFile('index.html', {root})
})

/*
app.post('/submit', (req, res) => {
    console.log("input:" , req.body)
    res.sendFile('visualizer.html', {root})
})
*/

app.get('/reactAPI', (req, res)=>{
    console.log("react api requested")
    res.json({
        input: "맛있는 점심이다. 맛없는 저녁이다. 오늘도 까마귀가 많다. 내일은 토끼가 뛰어다닌다.",
        novel:'새로운 소설이다. 해는 이미 한참 전에 저물어 사방은 가게들에서 새어 나오는 빛과 거리에 설치된 가로등만이 어둑한 길을 밝혀 주고 있었다. "벌써 해가 지는구나" 새빨갛게 빛나는 해를 얼마나 멍하니 바라보았을까, 그는 문득 목과 어깨가 꽤나 뻐근하단 걸 느꼈다. 그동안 잦은 야근으로 뻣뻣해진 걸까, 그는 가볍게 목을 꺾고 몸을 옆으로 돌리며 가볍게 풀기 시작했다. “끄응…. 몸도 예전 같지가 않네….” 확실히 운동을 제대로 못 해서 그런가. 나는 그렇게 생각하곤 했다.',
    })
})

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

app.use((err, req, res, next)=>{
    res.status(500).send(err.message)
})

app.listen(
    app.get('port'), ()=>{
    console.log("app listening")
})

