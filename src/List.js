import React from 'react';
import * as utils from './utils'
import { Sortable } from 'zent'
import cx from 'classnames';
import 'zent/css/index.css';


const urls = {
  getList: '/api/todo/list',
  changeTodo: '/api/todo/change?id='
}




class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
  }

  componentDidMount() {
    this.refresh()
  }

  processTodoList(todolist) {
    const list = todolist.slice()
    let p1, p2, p3, p4 = list.length - 1;
    for (let i in list) {
      switch (list[i].id) {
        case -1:
          p1 = i;
          break;
        case -2:
          p2 = i;
          break;
        case -3:
          p3 = i;
          break;
      }
    }

    let dx = 1 / (p1 + 1);
    for (let i = 1; i <= p1; i++) {
      list[i - 1].priority = dx * i;
    }
    dx = 1 / (p2 - p1);
    for (let i = 1; i < (p2 - p1); i++) {
      list[i + p1].priority = dx * i + 1;
    }
    dx = 1 / (p3 - p2);
    for (let i = 1; i < (p3 - p2); i++) {
      list[i + p2].priority = dx * i + 2;
    }
    dx = 1 / (p4 - p3 + 1);
    for (let i = 1; i <= (p4 - p3); i++) {
      list[i + p3].priority = dx * i + 3;
    }

    return list;
  }

  refresh = () => {
    const res = queryTodoList()
    res.then((result) => {
      this.setState({
        list: result
      })
    })
  }

  handleChange() {
    const list = this.state.list.slice()
    for (let i = 1; i <= list.length(); i++) {
      if (list[i].id <= 0) continue;
      changeTodo(list[i - 1])
    }
    this.refresh()
  }

  renderTodoList() {
    const list = this.state.list.slice()
    return (
      <Sortable items={list} onChange={this.refresh} filterClass="item-disabled">

        {list.map(({ title, id }) => (
          <div className={cx('zent-demo-sortable-basic-item', {
            'item-disabled': false,
          })} key={id}>
            {title}
          </div>
        ))}

      </Sortable>)
  }

  render() {
    console.log(this.state);
    return (
      <div className="todolist-mainpage">
        {this.renderTodoList()}
      </div>
    )
  }

}


async function changeTodo(todo) {
  const data = {
    priority: todo.priority
  }
  let res = await utils.Fetch(urls.changeTodo + todo.id, 'POST', JSON.stringify(data));
  let jsdata = await res.json()
  if (res.status !== 200) {
    console.log(jsdata.data)
  }
}


async function queryTodoList() {
  let res = await utils.Fetch(urls.getList, 'GET')
  let jsdata = await res.json()
  if (res.status !== 200) {
    console.log(jsdata.data);
  }
  let datas = []
  for (let i = 1; i <= jsdata.Msg.length; i++) {
    let data = {}
    data.title = jsdata.Msg[i - 1].Title;
    data.id = jsdata.Msg[i - 1].ID;
    data.priority = jsdata.Msg[i - 1].Priority;
    datas.push(data)
  }
  datas.sort((a, b) => (a.priority - b.priority))
  let i = 0, tp = 1
  let ret = []
  while (i < datas.length) {
    if (datas[i].priority > tp) {

      ret.push({
        title: "---",
        id: -1 * tp,
        priority: tp,
      })
      tp++;
      continue;
    }
    ret.push(datas[i])
    i++;
  }
  return ret
}

export default TodoList