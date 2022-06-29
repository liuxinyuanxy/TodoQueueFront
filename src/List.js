import React from 'react';
import * as utils from './utils'
import { Sortable, Card } from 'zent'
import { TodoCard }from './Todo'
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
  componentWillUnmount() {
    console.log("qwqqwqqqwqwq")
  }

  componentDidMount() {
    this.refresh()
  }

  processTodoList(todolist) {
    // console.log(todolist)
    const list = todolist.slice()
    let cnt = 0, p = []
    p[0] = -1
    p[4] = list.length
    for (let i = 0; i < list.length; i++) {
      if (list[i].id < 0) {
        p[++cnt] = i;
        list[i].priority = cnt
      }
    }

    for (let i = 0; i < 4; i++) {
      let dx = 1 / (p[i + 1] - p[i])
      for (let j = 1; j < (p[i + 1] - p[i]); j++) {
        list[j + p[i]].priority = dx * j + i;
      }
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

  handleChange = (items) => {
    const list = this.processTodoList(items);
    for (let i = 1; i <= list.length; i++) {
      if (list[i - 1].id <= 0) continue;
      changeTodo(list[i - 1])
    }
    this.setState({
      list: list
    })
  }

  onMove = (e, originalEvent) => {
    const { onMove } = this.props;
    if (onMove) {
      return onMove(e, originalEvent);
    }
    // insert point is based on direction
    return true;
  }

  renderTodo(id, title) {
    const style = {
      "background-color": "#69A794",
      "height": "20px"
    }
    
    if (id <= 0) {
      return (<Card  style={style}>{title}</Card>)
    } else {
      return (<TodoCard id={id}
        title={title}
        refresher={() => this.refresh()} />)
    }
  }

  renderTodoList() {
    const list = this.state.list.slice()
    return (

      <Sortable items={list}
        scrollSensitivity={70}
        onChange={this.handleChange}
        filterClass="item-disabled"
        onMove={this.onMove}
        scrollSpeed={20}
      >

        {
          list.map(({ title, id }) => (
            <div className={cx('zent-demo-sortable-basic-item', {
              'item-disabled': id <= 0,
            })} key={id}>
              {this.renderTodo(id, title)}
            </div>
          ))
        }

      </Sortable >)
  }

  render() {
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
    console.log(jsdata.Msg)
  }
}


async function queryTodoList() {
  let res = await utils.Fetch(urls.getList, 'GET')
  let jsdata = await res.json()
  if (res.status !== 200) {
    console.log(jsdata.Msg);
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
        title: "",
        id: -1 * tp,
        priority: tp,
      })
      tp++;
      continue;
    }
    ret.push(datas[i])
    i++;
  }
  while (tp < 4) {
    ret.push({
      title: "",
      id: -1 * tp,
      priority: tp,
    })
    tp++;
  }
  return ret
}

export default TodoList