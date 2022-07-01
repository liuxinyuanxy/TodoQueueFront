import {
    Form,
    FormStrategy,
    Button,
    Dialog,
    Notify,
    Validators,
    FormInputField,
} from 'zent';
import React, {useCallback} from "react";
import 'zent/css/index.css';
import * as utils from "./utils";
let refresher

const { openDialog, closeDialog } = Dialog;
const registerID = "register";
const loginID = "login";
const changeID = "change";

function equalsPassword(value, ctx) {
    if (value !== ctx.getSectionValue('passwd').passwd) {
        return {
            name: 'passwordEqual',
            message: '两次填写的密码不一致',
        };
    }
    return null;
}

function RegisterForm() {
    const form = Form.useForm(FormStrategy.View);
    const resetForm = useCallback(() => {
        form.resetValue();
    }, [form]);
    const onSubmit = React.useCallback(form => {
        const value = form.getSubmitValue()
        utils.Fetch("/api/user/register", "POST", utils.GenerateFormDataFromObject(value)).then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            }else {
                res.json().then(res => {
                    Notify.success(res.Msg)
                    closeDialog(registerID)
                })
            }
        })
    }, []);
    return (
        <Form
            form={form}
            layout="vertical"
            scrollToError
            onSubmit={onSubmit}
        >
            <FormInputField
                name="name"
                label="昵称："
                required
                validators={[
                    Validators.required('请填写昵称'),
                    Validators.pattern(/^[a-zA-Z]+$/, '昵称只能是字母'),
                ]}
            />
            <FormInputField
                name="passwd"
                label="密码："
                required
                validators={[Validators.required('请填写密码')]}
                props={{
                    type: 'password',
                }}
            />
            <FormInputField
                name="confirmPw"
                label="确认密码："
                required
                validators={[equalsPassword]}
                props={{
                    type: 'password',
                }}
            />
            <FormInputField
                name="email"
                label="邮件"
                validators={[Validators.email('请填写正确的邮件')]}
            />
            <div className="zent-form-actions">
                <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  onClick={() => {form.submit()}}>
                    注册
                </Button>
                <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  outline onClick={resetForm}>
                    重置
                </Button>
            </div>
        </Form>
    );
}

function LoginForm() {
    const form = Form.useForm(FormStrategy.View);
    const resetForm = useCallback(() => {
        form.resetValue();
    }, [form]);
    const onSubmit = React.useCallback(form => {
        const value = form.getSubmitValue()
        Notify.info("正在提交，请稍候")
        console.log(value)
        utils.Fetch(`/api/user/login`, 'POST', utils.GenerateFormDataFromObject(value)).then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                refresher()
                closeDialog(loginID)
            }
        })
    }, []);
    return (
        <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            scrollToError
        >
            <FormInputField
                name="email"
                label="邮件"
                validators={[Validators.email('请填写正确的邮件')]}
            />
            <FormInputField
                name="passwd"
                label="密码："
                required
                validators={[Validators.required('请填写密码')]}
                props={{
                    type: 'password',
                }}
            />
            <div className="zent-form-actions">
                <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  onClick={() => {form.submit()} }>
                    登录
                </Button>
                <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  outline onClick={resetForm}>
                    重置
                </Button>
            </div>
        </Form>
    );
}

const register = () => {
    openDialog({
        dialogId: registerID,
        title: "注册",
        children: <>  <RegisterForm /> </>,
        footer : (<> <Button onClick={() => closeDialog(registerID)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

const login = () => {
    openDialog({
        dialogId: loginID,
        title: "登录",
        children: <>  <LoginForm /> </>,
        footer : (<> <Button onClick={() => closeDialog(loginID)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

function User(props) {
    refresher = props.refresher
    return (
        <>
            <Button onClick={register}>
                注册
            </Button>

            <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  outline onClick={login}>
                登录
            </Button>
        </>
    )
}

function ChangeForm() {
    const form = Form.useForm(FormStrategy.View);
    const onSubmit = React.useCallback(form => {
        const value = form.getSubmitValue()
        Notify.info("正在提交，请稍候")
        console.log(value)
        utils.Fetch(`/api/user/change/name?name=` + value.name, 'POST').then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                Notify.success("修改成功")
                refresher()
                closeDialog(changeID)
            }
        })
    }, []);
    return (
        <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            scrollToError
        >
            <FormInputField
                name="name"
                label="用户名"
                validators={[Validators.required('请填写用户名')]}
            />
            <div className="zent-form-actions">
                <Button
                    style={{
                        background:"rgba(187,222,214,0.76)",
                    }}  onClick={() => {form.submit()} }>
                    提交
                </Button>
            </div>
        </Form>
    );
}

function changeUserName() {
    openDialog({
        dialogId: changeID,
        title: "修改用户名",
        children: <>  <ChangeForm /> </>,
        footer : (<> <Button onClick={() => closeDialog(changeID)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

function UserLoggedIn(props) {
    refresher = props.refresher
       return (
        <>
            <> 欢迎您： {props.userName}
                <Button className={"inCardButton2"} onClick={changeUserName}> 修改用户名 </Button>
            </>
        </>
    )
}

export {User, UserLoggedIn}