import React, { useEffect, useState } from "react";
import "../AdminDashboard.css";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function AddMember() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000"; // Updated port for backend
  const [isLoading, setIsLoading] = useState(false);

  // State variables
  const [userFullName, setUserFullName] = useState("");
  const [admissionId, setAdmissionId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [recentAddedMembers, setRecentAddedMembers] = useState([]);
  const [userType, setUserType] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState(null);
  const [dobString, setDobString] = useState("");

  const genderTypes = [
    { value: "Male", text: "Male" },
    { value: "Female", text: "Female" },
  ];

  const userTypes = [
    { value: "Staff", text: "Staff" },
    { value: "Student", text: "Student" },
  ];

  const resetFields = () => {
    setUserFullName("");
    setAdmissionId("");
    setEmployeeId("");
    setAddress("");
    setEmail("");
    setPassword("");
    setMobileNumber("");
    setUserType("");
    setGender("");
    setAge("");
    setDob(null);
    setDobString("");
  };

  const addMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      userFullName &&
      userType &&
      age &&
      dobString &&
      gender &&
      address &&
      mobileNumber &&
      email &&
      password
    ) {
      const userData = {
        userType,
        userFullName,
        admissionId: userType === "Student" ? admissionId : null,
        employeeId: userType === "Staff" ? employeeId : null,
        age: Number(age), // Ensure age is a number
        dob: dobString,
        gender,
        address,
        mobileNumber,
        email,
        password,
      };

      try {
        const response = await axios.post(`${API_URL}/api/auth/register`, userData);
        const addedMember = response.data.user;

        setRecentAddedMembers((prevMembers) => {
          const updatedMembers = [addedMember, ...prevMembers];
          return updatedMembers.slice(0, 5); // Keep only the last 5 members
        });

        alert("Member Added Successfully");
        resetFields();
      } catch (err) {
        console.error("Error Response:", err.response?.data || err.message);
        alert(
          `Error adding member: ${
            err.response?.data?.message || "Please check the details and try again."
          }`
        );
      }
    } else {
      alert("All fields are required. Please fill in all the details.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const fetchRecentMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/allmembers`);
        setRecentAddedMembers(response.data.slice(0, 5));
      } catch (err) {
        console.error(err);
        alert("Error fetching recent members.");
      }
    };
    fetchRecentMembers();
  }, [API_URL]);

  return (
    <div>
        <p className="dashboard-option-title">Add a Member</p>
        <div className="dashboard-title-line"></div>
        <form className="addmember-form" onSubmit={addMember}>
            <div className='semanticdropdown'>
                <Dropdown
                    placeholder='User Type'
                    fluid
                    selection
                    options={userTypes}
                    onChange={(event, data) => setUserType(data.value)}
                />
            </div>
            <label className="addmember-form-label" htmlFor="userFullName">Full Name<span className="required-field">*</span></label><br />
            <input className="addmember-form-input" type="text" name="userFullName" value={userFullName} required onChange={(e) => setUserFullName(e.target.value)}></input><br />

            <label className="addmember-form-label" htmlFor={userType === "Student" ? "admissionId" : "employeeId"}>{userType === "Student" ? "Admission Id" : "Employee Id"}<span className="required-field">*</span></label><br />
            <input className="addmember-form-input" type="text" value={userType === "Student" ? admissionId : employeeId} required onChange={(e) => { userType === "Student" ? setAdmissionId(e.target.value) : setEmployeeId(e.target.value) }}></input><br />

            <label className="addmember-form-label" htmlFor="mobileNumber">Mobile Number<span className="required-field">*</span></label><br />
            <input className="addmember-form-input" type="text" value={mobileNumber} required onChange={(e) => setMobileNumber(e.target.value)}></input><br />

            <label className="addmember-form-label" htmlFor="gender">Gender<span className="required-field">*</span></label><br />
            <div className='semanticdropdown'>
                <Dropdown
                    placeholder='User Type'
                    fluid
                    selection
                    value={gender}
                    options={genderTypes}
                    onChange={(event, data) => setGender(data.value)}
                />
            </div>

            <label className="addmember-form-label" htmlFor="age">Age<span className="required-field">*</span></label><br />
            <input className="addmember-form-input" type="text" value={age} required onChange={(e) => setAge(e.target.value)}></input><br />

            <label className="addmember-form-label" htmlFor="dob">Date of Birth<span className="required-field">*</span></label><br />
            <DatePicker
                className="date-picker"
                placeholderText="MM/DD/YYYY"
                selected={dob}
                onChange={(date) => { setDob(date); setDobString(moment(date).format("MM/DD/YYYY")) }}
                dateFormat="MM/dd/yyyy"
            />

            <label className="addmember-form-label" htmlFor="address">Address<span className="required-field">*</span></label><br />
            <input className="addmember-form-input address-field" value={address} type="text" required onChange={(e) => setAddress(e.target.value)}></input><br />

            <label className="addmember-form-label" htmlFor="email">Email<span className="required-field">*</span></label><br />
            <input className="addmember-form-input" type="email" value={email} required onChange={(e) => setEmail(e.target.value)}></input><br />

            <label className="addmember-form-label" htmlFor="password">Password<span className="required-field">*</span></label><br />
            <input className="addmember-form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br />

            <input className="addmember-submit" type="submit" value="SUBMIT" disabled={isLoading} ></input>

        </form>
        <p className="dashboard-option-title">Add a Member</p>
        <div className="dashboard-title-line"></div>
        <table className='admindashboard-table'>
            <tr>
                <th>S.No</th>
                <th>Member Type</th>
                
                <th>Member Name</th>
            </tr>
            {
    recentAddedMembers.map((member, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{member.userType}</td>
                
                <td>{member.userFullName}</td>
            </tr>
        )
    })
}

        </table>
    </div>
)
}

export default AddMember
