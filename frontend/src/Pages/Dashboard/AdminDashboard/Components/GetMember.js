import React, { useEffect, useState } from "react";
import "../AdminDashboard.css";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";
import "../../MemberDashboard/MemberDashboard.css";
import moment from "moment";

function GetMember() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [allMembersOptions, setAllMembersOptions] = useState([]);
  const [memberId, setMemberId] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Members
  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/allmembers`);
        setAllMembersOptions(
          response.data.map((member) => ({
            value: member?._id,
            text:
              member?.userType === "Student"
                ? `${member?.userFullName} [${member?.admissionId}]`
                : `${member?.userFullName} [${member?.employeeId}]`,
          }))
        );
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to fetch members. Please try again.");
      }
    };
    getMembers();
  }, [API_URL]);

  // Fetch Member Details
  useEffect(() => {
    const getMemberDetails = async () => {
      if (memberId) {
        setLoading(true);
        setError("");
        try {
          const response = await axios.get(`${API_URL}/api/users/getuser/${memberId}`);
          setMemberDetails(response.data);
        } catch (err) {
          console.error("Error fetching member details:", err);
          setError("Failed to fetch member details. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    getMemberDetails();
  }, [API_URL, memberId]);

  const renderTable = (data, headers, keyExtractor) => (
    <table className="activebooks-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <tr key={keyExtractor(item)}>
              {headers.map((_, idx) => (
                <td key={idx}>{item[idx]}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderMemberDetails = () => (
    <div>
      <div className="member-profile-content" id="profile@member">
        <div className="user-details-topbar">
          <img className="user-profileimage" src="./assets/images/Profile.png" alt="" />
          <div className="user-info">
            <p className="user-name">{memberDetails?.userFullName}</p>
            <p className="user-id">
              {memberDetails?.userType === "Student"
                ? memberDetails?.admissionId
                : memberDetails?.employeeId}
            </p>
            <p className="user-email">{memberDetails?.email}</p>
            <p className="user-phone">{memberDetails?.mobileNumber}</p>
          </div>
        </div>

        <div className="user-details-specific">
          <div className="specific-left">
            <p>
              <b>Age:</b> {memberDetails?.age}
            </p>
            <p>
              <b>Gender:</b> {memberDetails?.gender}
            </p>
            <p>
              <b>DOB:</b> {moment(memberDetails?.dob).format("MM/DD/YYYY")}
            </p>
            <p>
              <b>Address:</b> {memberDetails?.address}
            </p>
          </div>
          <div className="specific-right">
            <p>
              <b>Points:</b> {memberDetails?.points || 0}
            </p>
            <p>
              <b>Rank:</b> {memberDetails?.rank || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="member-activebooks-content" id="activebooks@member">
        <p className="section-title">Issued Books</p>
        {renderTable(
          memberDetails?.activeTransactions
            ?.filter((tx) => tx.transactionType === "Issued")
            ?.map((tx, idx) => [
              idx + 1,
              tx.bookName,
              moment(tx.fromDate).format("MM/DD/YYYY"),
              moment(tx.toDate).format("MM/DD/YYYY"),
              Math.max(
                0,
                Math.floor((new Date() - new Date(tx.toDate)) / (1000 * 60 * 60 * 24)) * 10
              ),
            ]),
          ["S.No", "Book-Name", "From Date", "To Date", "Fine"],
          (tx) => tx[1]
        )}
      </div>

      <div className="member-reservedbooks-content" id="reservedbooks@member">
        <p className="section-title">Reserved Books</p>
        {renderTable(
          memberDetails?.activeTransactions
            ?.filter((tx) => tx.transactionType === "Reserved")
            ?.map((tx, idx) => [
              idx + 1,
              tx.bookName,
              moment(tx.fromDate).format("MM/DD/YYYY"),
              moment(tx.toDate).format("MM/DD/YYYY"),
            ]),
          ["S.No", "Book-Name", "From", "To"],
          (tx) => tx[1]
        )}
      </div>

      <div className="member-history-content" id="history@member">
        <p className="section-title">Transaction History</p>
        {renderTable(
          memberDetails?.prevTransactions?.map((tx, idx) => [
            idx + 1,
            tx.bookName,
            moment(tx.fromDate).format("MM/DD/YYYY"),
            moment(tx.toDate).format("MM/DD/YYYY"),
            moment(tx.returnDate).format("MM/DD/YYYY"),
          ]),
          ["S.No", "Book-Name", "From", "To", "Return Date"],
          (tx) => tx[1]
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="semanticdropdown getmember-dropdown">
        <Dropdown
          placeholder="Select Member"
          fluid
          search
          selection
          value={memberId}
          options={allMembersOptions}
          onChange={(event, data) => setMemberId(data.value)}
        />
      </div>

      {loading ? (
        <p>Loading member details...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : memberId && memberDetails ? (
        renderMemberDetails()
      ) : (
        <p>Please select a member to view their details</p>
      )}
    </div>
  );
}

export default GetMember;
