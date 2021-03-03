import React from "react";
import HomeNav from "./Homenav";
import "./Find.css";
import { acceptGame, gameObserver } from "../../lib/db";
import useAuth from "../../hooks/useAuth";
import Loading from "./Loading";
import { useHistory } from "react-router-dom";

const FindGames = () => {
  const [loading, setLoading] = React.useState(true);
  const [games, setGames] = React.useState<any>([]);
  const [search, setSearch] = React.useState(true);
  const [confirm, setConfirm] = React.useState(false);
  const [chosen, setChosen] = React.useState<any>();

  const auth = useAuth();
  const history = useHistory();
  React.useEffect(() => {
    if (auth?.user) {
      gameObserver(auth.user.uid).onSnapshot((docs) => {
        let games: any[] = [];
        docs.forEach((doc) => {
          let agame = doc.data();

          if(agame.waiting)
          games.push({ ...agame, gid: doc.id });
        });

        setGames(games);
    });
    setLoading(false);
    }
  }, [auth?.user]);

  React.useEffect(()=>{
     setTimeout(() => {
       if(games.length === 0){
           setSearch(false);
       } 
    },1000);
  },[])

  const accept = async (color: string, gid: string) =>{
      setLoading(true);
      //@ts-ignore
      await acceptGame(auth?.user.uid,auth?.user.nname, auth?.user.photo,color,gid);
      history.push('/hvhgame'); 
  }
  const gameSearch = () => {
      return search ? <h4>Searching for games...</h4> : <h4>Seems no game yet!</h4>
  }
  const showConfirm = ()=>{
     return <div id="confirm">
        <div id="confirmbox">
         <img className="chosenphoto" src={chosen.photo} alt="user"/>
         <h2>{chosen.uname}</h2>
         <h3>{chosen.color}</h3>
         <h4>{chosen.time === 0 ? "Unlimited" : chosen.time}</h4>
         <div>
            <button className="cbtn success"
            onClick={()=>accept(chosen.color, chosen.gid)} 
            >Accept</button> 
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <button onClick={()=>{
                setConfirm(false);
                setChosen({});
            }} className="cbtn cancel">Cancel</button>
         </div>
        </div> 
     </div> ;
  }
  
  if (loading) return <Loading />;

  return (
    <>
    {confirm && showConfirm()}
      <HomeNav />
      <div id="gamelist">
        {games.length > 0 ?
          //@ts-ignore
          games.map((e: any) => (
            <div id="usergame" onClick={()=>{setConfirm(true); setChosen(e)}}>
              <div id="usershow">
                <img src={e.photo} alt="user" />
                <span>{e.uname}</span>
              </div>
              <div id="gameinfo">
                <span id="gametime">
                  <i>Unlimited</i>
                </span>
                <br />
                <span id="gamecolor">
                  I will play as <i>{e.color}</i>
                </span>
              </div>
            </div>
          )):
          gameSearch()
          }
      </div>
      <button onClick={()=>history.push('/')} className="cbtn cancel">Back</button>
    </>
  );
};

export default FindGames;
