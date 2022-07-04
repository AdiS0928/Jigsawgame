
import React, {Component} from 'react';
import _ from 'lodash';
import Router from 'next/router'
import { serverRuntimeConfig } from '../next.config';

class Game extends Component{

    // constructor(props) {
    //     super(props);
    //     console.log(Router.query.name)
    //   }


    state = {
        pieces: [],
        shuffled: [],
        solved: [],
        numberLine: {
            1: {
              end: 60
            }
          },
          type: '',
          count:0
    };

    // counter(){
    //      setInterval(() => {
    //         this.setState({[this.state.limit]: this.state.limit - 1}, () => 
    //         console.log(this.state.limit))
    //         // displayTime(timeSecond);
    //         // console.log(this.state.limit);
    //         if (this.state.limit == 0 || this.state.limit < 1) {
    //           endCount();
    //           clearInterval(countDown);
    //         }
    //       }, 1000);
    //     }
    counter() {
        const that = this;
        var temp;
        function timer() {
          //clone
          const copy = _.cloneDeep(that.state.numberLine);
          let currentValue = that.state.numberLine["1"].end;
          //increment
          currentValue--;
          
          //assign
          copy["1"].end = currentValue;
          //setState
          temp = copy["1"].end;
          that.setState({
            numberLine: copy
          });
          //chaos
        //   console.log(that.state.numberLine["1"].end)
        if (temp == 0 || temp < 1) {
            
            Router.push({
                pathname: '/leaderboard',
                query: { name: Router.query.name, score: 0 }
            });
          }
        }
        clearInterval(counter);
        const counter = setInterval(timer, 1000);
        

      }

    componentDidMount(){
    const rand = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    console.log(rand);

    
    if(rand == 1){
        const pieces = [...Array(16)].map((_,i) => (
            {
                img: `cat${(i+1)}.png`,
                order: i,
                board: 'shuffled'
            }
        ));
    this.setState({
        pieces,
        shuffled: this.shufflePieces(pieces),
        solved: [...Array(16)],
        type: 'cat',
        original: 'catorg.png'
    });
    }
    else if (rand == 2){
        const pieces = [...Array(16)].map((_,i) => (
            {
                img: `dog${(i+1)}.png`,
                order: i,
                board: 'shuffled'
            }
        ));
        this.setState({
            pieces,
            shuffled: this.shufflePieces(pieces),
            solved: [...Array(16)],
            type: 'dog',
            original: 'dogorg.png'
        });
    }
    else if(rand == 3){
        const pieces = [...Array(16)].map((_,i) => (
            {
                img: `catcool${(i+1)}.jpeg`,
                order: i,
                board: 'shuffled'
            }
        ));
        this.setState({
            pieces,
            shuffled: this.shufflePieces(pieces),
            solved: [...Array(16)],
            type: 'catcool',
            original: 'catcoolorg.png'
        });
    }

    }

    // renderPiecesContainer(piece, index, boardName){
    //     return(
    //         <li key={index}>
    //             {piece && <Image src= {`./images/${piece.img}`} />}
    //         </li>
    //     );
    // }

    handleDrop(e, index, targetName) {
        let target = this.state[targetName];
        if (target[index]) return;
    
        const pieceOrder = e.dataTransfer.getData('text');
        const pieceData = this.state.pieces.find(p => p.order === +pieceOrder);
        const origin = this.state[pieceData.board];
    
        if (targetName === pieceData.board) target = origin;
        origin[origin.indexOf(pieceData)] = undefined;
        target[index] = pieceData;
        pieceData.board = targetName;
    
        this.setState({ [pieceData.board]: origin, [targetName]: target })

      }
      

    handleDragStart(e, order) {
        e.dataTransfer.setData('text/plain', order);
        
        if(this.state.count==0){
            this.setState({count: 1})
            this.counter();
        }
        console.log(this.state.count);
      }

    check(){
        
        // if (this.state.pieces == this.state.solved){
        //     console.log("Solved")
        // }
        // else {
        //     console.log("s1",this.state.pieces)
        //     console.log("s2",this.state.solved)
        // }


        // (async () => {
        //     const res = await fetch('/api/user', {
        //         method: 'POST',
        //         body: JSON.stringify({name: Router.query.name,score: 0}),
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     })
        //     const data = await res.json();
        //     console.log(data);
        // })()
        // console.log("solved!")
        // if(typeof window !== 'undefined')
        //     Router.push({
        //         pathname: '/leaderboard',
        //         query: { name: "gay", score: 0}
        //     });


        var l = 15
        for(let i=0; i<this.state.pieces.length;i++){
            if(this.state.solved[i]!= undefined){
                console.log(this.state.solved[i])
                if(!this.state.solved[i].img==this.state.pieces[i].img)
                {
                    break;
                }
                else if(i==l){
                    (async () => {
                        const res = await fetch('/api/user', {
                            method: 'POST',
                            body: JSON.stringify({name:Router.query.name,score: this.state.numberLine["1"].end}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        const data = await res.json();
                        console.log(data);
                    })()
                    console.log("solved!")
                    Router.push({
                        pathname: '/leaderboard',
                        query: { name: Router.query.name, score: this.state.numberLine["1"].end * 3}
                    });
                }
            }
            else
                break;
        }
    }


    

    render() {
        return(
        <div className='puzzle bg-[url(/wood.jpg)] h-screen'>
            
            <ul className='jigsaw__shuffled-board'>
                {
                    this.state.shuffled.map((piece, i) =>
                    // this.renderPieceContainer(piece, i, 'shuffled'))
                    <li onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => this.handleDrop(e, i, 'shuffled')}
                    key={i}>
                        {piece && <img draggable
                        onDragStart={(e) => this.handleDragStart(e, piece.order)}
                        src= {`./${this.state.type}/${piece.img}`} />}
                    </li>)
                }
            </ul>
            <ol className='jigsaw__solved-board' style={{backgroundImage: `url(./${this.state.type}/${this.state.original})`}}>
                {
                    this.state.solved.map((piece, i) => 
                    // this.renderPiecesContainer(piece, i, 'solved'))
                    <li onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => this.handleDrop(e, i, 'solved')}
                    key={i}>
                        {piece && <img draggable 
                        onDragStart={(e) => this.handleDragStart(e, piece.order)}
                        src= {`./${this.state.type}/${piece.img}`} />}
                    </li>)             
                }
            </ol>

            <h1 className='text-3xl font-extrabold font-serif'>Countdown: <span>{this.state.numberLine["1"].end}</span></h1>

            {
            this.check()
            }
        
        </div>

    );
        }


    shufflePieces(pieces){
        const shuffled = [...pieces];

        for (let i= shuffled.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }
}

export default Game;
