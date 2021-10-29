import React from "react";
import RequestCard from "./requestsCard";


function EmployeeCardList ({ data }) {
    return (
            data.map(request => (
            <RequestCard
                demandeur={request[0][0]}
                date={request[0][1]}
            />
            ))
    )
}

export default EmployeeCardList;