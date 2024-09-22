import React, { useState } from 'react';
import styles from './Sidebar.module.css'; // For styling
import filters from '../../utils/filters'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ setFilters }) => {
	const handleClick = (e) => {

		setFilters((old) => {
			const { value, checked } = e.target

			if (checked) {
				return [...old, value]
			} else {
				return old.filter((item) => item !== value)
			}
		})
	}

	return (
		<Accordion alwaysOpen>
			{
				filters.map((filter, index) => (
					<Accordion.Item key={index} eventKey={index}>
						<Accordion.Header>{filter.section}</Accordion.Header>
						<Accordion.Body>
							{filter.fields.map(property => (
								<>
									<input key={property.id} id={property.id} type="checkbox" name={property.id} value={property.value} onClick={(e) => handleClick(e)}></input>
									<label htmlFor={property.id} onClick={(e) => handleClick(e)}>{property.value}</label>
									<br />
								</>

							))}
						</Accordion.Body>
					</Accordion.Item>
				))
			}
			{/* <Accordion.Item eventKey="0">
				<Accordion.Header>Accordion Item #1</Accordion.Header>
				<Accordion.Body>
					Lorem ipsum d
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="1">
				<Accordion.Header>Accordion Item #2</Accordion.Header>
				<Accordion.Body>
					Lorem ipsum d
				</Accordion.Body>
			</Accordion.Item> */}
		</Accordion>
	);
};

export default Sidebar;
