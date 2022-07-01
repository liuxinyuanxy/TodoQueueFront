import React from "react";
import {Button, Card, Affix} from "zent";
import * as utils from "./utils";
import {User, UserLoggedIn} from "./User";
import {TodoPage} from "./TodoPage";
import Icon from "./icon.png";
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
        utils.Fetch("/api/user/get", "GET").then(res => {
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
                    <Card>
                        <>
                            {this.state.isLoggedIn ? (<><UserLoggedIn  refresher={() => this.refresh()} userName={this.state.userName} /> </>) : (<> <User refresher={() => this.refresh()}/> </>)}
                            <img style={{width:"auto", maxHeight:'50px',right:'10px',position:'absolute'}} src={Icon}></img>
                        </>
                    </Card>
                    
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
                {this.Header()}
                {this.Body()}
                {this.Tail()}
            </>
        )
    }
}

export default MainPage