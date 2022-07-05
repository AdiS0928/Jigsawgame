
import React, {Component} from 'react';
import _ from 'lodash';
import Router from 'next/router'
import { serverRuntimeConfig } from '../next.config';
import {Howl} from 'howler'

async function savedUser(user){
    const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(user)
    });

    if(!response.ok){
        throw Error(response.statusText);
    }

    Router.push({
        pathname: '/leaderboard',
        query: { name: user.name, score: user.score}
    });

    return await response.json();
}
class Game extends Component{


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
          count:0,
          check: 0
    };

    counter() {
        const that = this;
        var temp;
        function timer() {
     
          const copy = _.cloneDeep(that.state.numberLine);
          let currentValue = that.state.numberLine["1"].end;
    
          currentValue--;
          
  
          copy["1"].end = currentValue;
 
          temp = copy["1"].end;
          that.setState({
            numberLine: copy
          });

        if (temp == 0 || temp < 1) {
            clearInterval(counter);
            Router.push({
                pathname: '/leaderboard',
                query: { name: Router.query.name, score: 0 }
            });
            
          }
        
          if(that.state.check == 1){
            clearInterval(counter);
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

    handleDrop(e, index, targetName) {
        var soundD = new Howl(
            {
                src:"/drop.wav",
                html5:true
            }

        )

        soundD.play();
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

        this.check();

      }
      

    handleDragStart(e, order) {
        e.dataTransfer.setData('text/plain', order);

        var soundC = new Howl(
            {
                src:"/click.wav",
                html5:true
            }

        )

        soundC.play();
        
        if(this.state.count==0){
            this.setState({count: 1})
            this.counter();
        }
        console.log(this.state.count);
      }

    check(){
        var l = 15
        var count=0;
        for(let i=0; i<this.state.pieces.length;i++){
            if(this.state.solved[i]!= undefined){
                if(this.state.solved[i].img==this.state.pieces[i].img)
                {
                    if(count==l){
                        this.setState({check:1});
                        (async () => {await savedUser({name:Router.query.name,score: this.state.numberLine["1"].end * 3});}
                        )()
                        
                    }
                    count++
                }
                else{
                    count = 0;
                    break;}
            }
        }
    }

    render() {
        return(
        <div className='puzzle bg-[url(/wood.jpg)] h-screen'>
            
            <ul className='jigsaw__shuffled-board'>
                {
                    this.state.shuffled.map((piece, i) =>

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
