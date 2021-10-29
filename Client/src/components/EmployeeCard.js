import React from "react";
import "./Style/cardthing.css";
import checkImg from "./images/check.png";
import { handleConfirmation } from "./functions";

 function EmployeeCard({ name, seniority, domaine, email, tel, profile, location, publicId}) {
    return (
        <div className="md:flex bg-white shadow text-gray-800 my-4 py-4 px-10 rounded-md items-center justify-between hover:bg-gray-300">
            <p className="font-bold text-md">name: {name}</p>
            <p>{domaine} with Seniority : {seniority}</p>
            <p className="text-blue-500">{email}</p>
            <p> phone : {tel}</p>
            <p>location: {location}</p>
            <img src={checkImg} alt={"Check"} onClick={handleConfirmation(publicId)} />
        </div>
    )
}

export default EmployeeCard;