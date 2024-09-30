import { useState } from 'react';
import axios from 'axios';

function Audit({ setAudits, audits }) {
  return (
    <div>
      <div>
        {audits && audits.length > 0 ? (
          audits.map((audit, index) => (
            <div key={audit.id}>

              <p>Salary: {audit.salary}</p>
              <p>Type: {audit.type}</p>
              <p>Date Changed: {audit.date}</p>
            </div>
          ))
        ) : (
          <div>No audits available</div>
        )}
      </div>
    </div>
  );
}

export default Audit;
