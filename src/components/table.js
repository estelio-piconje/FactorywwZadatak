import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import "./style/style.css";

import { AiOutlineSortAscending } from "react-icons/ai";

const Table = () => {
  const [podaci, setPodaci] = useState([]);
  const [data, setData] = useState(podaci);
  const [users, setUsers] = useState([]);
  const [sortedField, setSortedField] = React.useState(null);

  useEffect(() => {
    getPodaci();
  }, []);

  const getPodaci = async () => {
    const response = await fetch("https://fww-demo.herokuapp.com/");
    const data = await response.json();
    setPodaci(data);

    convertData(data);
  };

  const convertData = (param) => {
    let users = [];
    for (let i = 0; i < param.length; i++) {
      let country = param[i].country;
      for (let j = 0; j < param[i].state.length; j++) {
        let stateName = param[i].state[j].name;
        for (let k = 0; k < param[i].state[j].users.length; k++) {
          let user = {
            country: country,
            state: stateName,
            ...param[i].state[j].users[k],
          };
          users.push(user);
        }
      }
    }
    setUsers(users);
    setData(users);
  };

  const handleChange = (value) => {
    filterData(value);
  };

  const filterData = (value) => {
    let resultArray = [];
    const regex = new RegExp(value, "gi");
    if (!value) {
      setData(users);
    } else {
      for (let i = 0; i < users.length; i++) {
        for (const property in users[i]) {
          if (regex.test(users[i][property])) {
            resultArray.push(users[i]);
            break;
          }
        }
      }
      setData(resultArray);
    }
  };

  const sortTable = (param) => {
    setSortedField(param);
    let sortedUsers = [...data];

    sortedUsers.sort((a, b) => {
      if (a[sortedField] < b[sortedField]) {
        return -1;
      } else if (a[sortedField] > b[sortedField]) {
        return 1;
      }
      return 0;
    });
    setData(sortedUsers);
  };

  return (
    <div>
      <div className="Search">
        <input
          className="inputName"
          type="text"
          placeholder="Search by Name, Balance, Activity, Registration Date, State or Country..."
          onChange={(e) => handleChange(e.target.value)}
        />
        <div className="tips">
          <span style={{ color: "#dc3545" }}>Tips</span>
          <span className="tip">Search activity by True or False</span>
          <span className="tip">
            Search by Registration Date example 2014-02-22
          </span>
        </div>
      </div>
      <div className="TableDiv">
        <table>
          <thead className="padding">
            <tr>
              <th onClick={() => sortTable("fullName")}>
                Full Name <AiOutlineSortAscending className="sortIcon" />
              </th>
              <th onClick={() => sortTable("balance")}>
                Balance
                <AiOutlineSortAscending className="sortIcon" />
              </th>
              <th onClick={() => sortTable("isActive")}>
                Active <AiOutlineSortAscending className="sortIcon" />
              </th>
              <th onClick={() => sortTable("registered")}>
                Registered Date <AiOutlineSortAscending className="sortIcon" />
              </th>
              <th onClick={() => sortTable("state")}>
                State <AiOutlineSortAscending className="sortIcon" />
              </th>
              <th onClick={() => sortTable("country")}>
                Country <AiOutlineSortAscending className="sortIcon" />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.balance}</td>
                <td>
                  {user.isActive ? (
                    <RiCheckboxCircleLine
                      style={{
                        color: "#3dda33",
                        backgroundColor: "transparent",
                        paddingTop: "5px",
                      }}
                    />
                  ) : (
                    <RiCheckboxBlankCircleLine
                      style={{
                        color: "#dc3545",
                        backgroundColor: "transparent",
                        paddingTop: "5px",
                      }}
                    />
                  )}
                </td>
                <td>{moment(user.registered).format("LLL")}</td>
                <td>{user.state}</td>
                <td>{user.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
