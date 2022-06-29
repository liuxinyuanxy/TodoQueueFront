import React from "react";
import {Button, Card, Affix} from "zent";
import * as utils from "./utils";
import User from "./User";
import TitlePic from "./title.jpg";
import {TodoPage} from "./TodoPage";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userName: "qwq",
            page: 1,
        }
        this.refresh()
    }
    refresh() {
        utils.Fetch("/api/user/change/get", "GET").then(res => {
            if (res.status === 200)
            {
                this.setState({isLoggedIn:true})
                res.json().then(res => {
                    this.setState({userName:res.Msg.Nickname})
                })
            }
        })
    }
    Header() {
        return (
            <>
                    <Card>{this.state.isLoggedIn ? (<> 欢迎您： {this.state.userName}</>) : (<> <User refresher={() => this.refresh()}/> </>)}</Card>
            </>
        )
    }
    Body() {
        switch (this.state.page) {
            case 1:
                return (<> <TodoPage/> </>)
        }
    }
    Tail() {
        return (
            <Affix offsetBotton={0}>
            <div style={{
                position: 'fixed',
                height:"7%",
                bottom: "0",
                width:"100%",
            }}>
                    <Button type={"primary"} onClick={() => (this.setState({page:1}))} style={{
                        margin:"0",
                        width:"33.3%",
                        height:"100%",
                        background:"green",
                    }}> qwq  </Button>
                    <Button type={"primary"}  onClick={() => (this.setState({page:2}))} style={{
                        margin:"0",
                        width:"33.3%",
                        height:"100%",
                        background:"red",
                    }}> qwq  </Button>
                    <Button type={"primary"}  onClick={() => (this.setState({page:3}))} style={{
                        margin:"0",
                        width:"33.3%",
                        height:"100%",
                        background:"blue",
                    }}> qwq  </Button>
            </div>
            </Affix>
        )
    }
    render() {
        return (
            <>
                {/*<img style={{maxWidth:"100%", height:'auto'}} src={TitlePic}></img>*/}
                {this.Header()}
                {this.Body()}
                {this.Tail()}
            </>
        )
    }
}

export default MainPage