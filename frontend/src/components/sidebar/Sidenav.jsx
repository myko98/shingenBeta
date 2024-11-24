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
		<Accordion alwaysOpen className={styles.sidebar} defaultActiveKey={["0", "1", "2", "3"]}>
			{
				filters.map((filter, index) => (
					<Accordion.Item key={index} eventKey={index.toString()} className={styles.item}>
						<Accordion.Header className={`${styles.header} ${styles.item}`}>{filter.section}</Accordion.Header>
						<Accordion.Body className={styles.item}>
							{filter.fields.map(property => (
								<>
									<input className={styles.checkbox} key={property.id} id={property.id} type="checkbox" name={property.id} value={property.value} onClick={(e) => handleClick(e)}></input>
									<label htmlFor={property.id} onClick={(e) => handleClick(e)}>{property.value}</label>
									<br />
								</>

							))}
						</Accordion.Body>
					</Accordion.Item>
				))
			}
		</Accordion>
	);
};

export default Sidebar;
