import { useState } from 'react';
import axios from 'axios';

function Audit({ setAudits, audits }) {
  return (
    <div>
      <h2>Audits</h2>
      <div class="auditsContainer">
        {audits && audits.length > 0 ? (
          audits.map((audit, index) => (
            <div className="audit" key={audit.id}>

              <p>Salary: {audit.salary}</p>
              <p>Type: {audit.type}</p>
              <p>Date Changed: {audit.date}</p>
            </div>
          ))
        ) : (
          <div className="noAudits">No audits available</div>
        )}
      </div>
    </div>
  );
}

export default Audit;
