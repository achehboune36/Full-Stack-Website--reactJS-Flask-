import React from "react";
import EmployeeCard from "./EmployeeCard";


function EmployeeCardList ({ data }) {
    return (
            data.map(employee => (
            <EmployeeCard
                key={employee.public_id}
                seniority={employee.seniority}
                name={employee.name}
                domaine={employee.domaine}
                email={employee.email}
                tel={employee.tel}
                profile={employee.profile}
                location={employee.location}
                publicId={employee.public_id}
            />
            ))
    )
}

export default EmployeeCardList;