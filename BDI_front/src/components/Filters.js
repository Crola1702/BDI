import React, { useState } from 'react';
import '../App.css';

import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

function Filters({ price, handleChange, min, max, onFilter }) {
  const [contractType, setContractType] = useState('All');
  const [characteristics, setCharacteristics] = useState('');
  const intl = useIntl();

  const handleTags = (event) => {
    setCharacteristics(event.target.value);
  };

  const handleFilterClick = () => {
    onFilter(characteristics, contractType); // Call the prop function with the values
  };

  return (
    <div className='filters-container responsive'>
      <div className='filters-column'>
        <div className='filters-tags'>
          <p className='price-title'>Tags</p>
          <input type='text' className='input-tags' placeholder={intl.formatMessage({ id: "CharacteristicsExample" })} onChange={handleTags} value={characteristics}/>
        </div>
      </div>
      <div className='filters-column'>
        <div className='filters-tags'>
          <p className='price-title'><FormattedMessage id='ContractType' /></p>
          <select className='select-filter' onChange={(e) => setContractType(e.currentTarget.value)}>
            <option value='All'><FormattedMessage id='All' /></option>
            <option value='Rent'><FormattedMessage id='Rent' /></option>
            <option value='Sale'><FormattedMessage id='Sale' /></option>
            <option value='Vacational'><FormattedMessage id='Vacational' /></option>
          </select>
        </div>
        <button className='filter' onClick={handleFilterClick}>
          <FormattedMessage id='Filter' />
        </button>
      </div>
      <div className='filters-column'>
        <div className='filters-price'>
          <div>
            <p className='price-title'>
              <FormattedMessage id="Price" />
            </p>
          </div>
          <div>
            <input
              className='input-price'
              type="range"
              defaultValue={price}
              onChange={handleChange}
              min={min}
              max={max}
            />
            <p className='price'>
              <FormattedNumber value={price} style="currency" currency="COP" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
