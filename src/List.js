import React from 'react';
import ReactDOM from 'react-dom/client';
import { Sortable } from 'zent'
import cx from 'classnames';
import 'zent/css/index.css';

const urls = {
  getList: 'http://124.221.92.18:1323/api/todo/list',
  changeTodo: "http://124.221.92.18:1323/api/todo/change"
}

const GetConfig = {
  method: 'GET',
  mode: 'cors',
  credentials: 'same-origin',
}

const PostConfig = {
  method: 'POST',
  mode: 'cors',
  credentials: 'same-origin',
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
    this.refresh()
  }

  async changeTodo(todo) {
    let res = await fetch(urls.changeTodo + "?id="+todo.id,PostConfig);
    
  }

  async queryTodoList() {
    let res = await fetch(urls.getList, GetConfig)
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
          title: "",
          id: -1 * tp,
          priority: tp,
        })
        tp++;
      }
      ret.push(datas[i])
    }
    return ret
  }

  processTodoList(todolist) {
    const list = todolist.slice()
    let p1, p2, p3, p4;
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
        case -4:
          p4 = i;
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
    dx = 1 / (p4 - p3);
    for (let i = 1; i < (p4 - p3); i++) {
      list[i + p3].priority = dx * i + 3;
    }

    return list;
  }

  refresh() {
    const res = this.queryTodoList()
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
      this.changeTodo()
    }

  }

  renderTodoList() {
    const list = this.list

    return (
      <Sortable items={list} onChange={this.handleChange}>

        {list.map(({ title, id }) => (
          <div className="zent-demo-sortable-basic-item" key={id}>
            {title}
          </div>
        ))}
      </Sortable>)
  }

  render() {
    return (
      <div className="todolist-mainpage">
        {this.renderTodoList()}
      </div>
    )
  }

}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TodoList />);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Sortable } from 'zent';
// import cx from 'classnames';
// import 'zent/css/index.css';


// class Simple extends React.Component {
//   state = {
//     list: [
//       {
//         index:1,
//         name: 'Arvin',
//       },
//       {
//         index:2,
//         name: 'Jack',
//       },
//       {
//         index:3,
//         name: 'Bob',
//       },
//       {
//         index:4,
//         name: 'Nick',
//       },
//       {
//         index:5,
//         name: 'Baka',
//       },
//       {
//         index:6,
//         name: 'Qaq',
//       },
//       {
//         index:7,
//         name: 'AQA',
//       },
//     ],
//   };

//   handleChange = items => {
//     this.setState({
//       list: items,
//     });
//   };

//   render() {
//     const { list } = this.state;
//     return (
//       <div className="demo-sortable-wrapper">
//         <Sortable items={list} onChange={this.handleChange} filterClass="item-disabled">
//           {list.map(({ name ,index }) => (
//             <div className={cx('zent-demo-sortable-basic-item', {
//               'item-disabled': index == 4 ,
//             })} key={name}>
//               {name}
//             </div>
//           ))}
//         </Sortable>
//       </div>
//     );
//   }
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<Simple />);

