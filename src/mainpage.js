import React from "react";
import {Button, Card, Affix} from "zent";
import * as utils from "./utils";
import User from "./User";
import TitlePic from "./title.jpg";
import {TodoPage} from "./TodoPage";
import DonePage from "./DonePage"
import TemplatePage from "./TemplatePage"
import Progress from "./Clock";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userName: "qwq",
            page: 2,
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
            <div>
                    <Card>{this.state.isLoggedIn ? (<> 欢迎您： {this.state.userName}</>) : (<> <User refresher={() => this.refresh()}/> </>)}</Card>
            </div>
        )
    }
    Body() {
        if (!this.state.isLoggedIn)
            return (<></>)
        switch (this.state.page) {
            case 1:
                return (<> <TodoPage/> </>)
            case 2:
                return (<> <Progress/> </>)
            case 3:
                return  (<> <TemplatePage/> </>)
            case 4:
                return  (<> <DonePage/> </>)
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
                {this.state.page !== 1 ?  <Button onClick={() => (this.setState({page:1}))} style={{
                        margin:"0",
                        width:"33.4%",
                        height:"100%",
                    background:"#8ac6d1",
                    }}> Todo  </Button> : <Button onClick={() => (this.setState({page:4}))} style={{
                    margin:"0",
                    width:"33.4%",
                    height:"100%",
                    background:"#8ac6d1",
                }}>  已完成 </Button>}
                    <Button  onClick={() => (this.setState({page:2}))} style={{
                        margin:"0",
                        width:"33.3%",
                        height:"100%",
                        background:"#C3AED6",
                    }}> Clock  </Button>
                    <Button  onClick={() => (this.setState({page:3}))} style={{
                        margin:"0",
                        width:"33.3%",
                        height:"100%",
                        background:"#8ac6d1",
                    }}> 模板  </Button>
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