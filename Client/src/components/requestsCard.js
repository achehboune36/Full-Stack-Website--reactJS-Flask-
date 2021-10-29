import React from "react";
import "./Style/cardthing.css";

 function RequestCard({ demandeur, date}) {
    return (
        <div className="md:flex bg-white shadow text-gray-800 my-4 py-4 px-10 rounded-md items-center justify-between hover:bg-gray-300">
            <p className="font-bold text-md">demandeur: {demandeur}</p>
            <p>with date : {date}</p>
        </div>
    )
}

export default RequestCard;