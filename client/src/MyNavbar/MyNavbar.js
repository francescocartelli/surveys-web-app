import { Navbar, Dropdown } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight, CardList } from "react-bootstrap-icons";
import './MyNavbar.css'

const appName = '.surveys';

function MyNavbar(props) {
	return (
		<Navbar variant='dark p-1 shadow' expand='sm' fixed="top" className='justify-content-between nav-container'>
			<Navbar.Brand href="/" className='mx-2 navbar-brand'>
				<CardList size={24} />{' '}{appName}
			</Navbar.Brand>
			<UserProfileButton user={props.user} doLogOut={props.doLogOut} />
		</Navbar>
	)
}

// User profile button 
function UserProfileButton(props) {
	return (
		<Dropdown>
			<Dropdown.Toggle id="dropdown-basic" className='px-1 drop-btn'>
				<span className='pr-2'>{props.user}</span>
				<PersonCircle size={24} />
			</Dropdown.Toggle>

			<Dropdown.Menu alignRight>
				<Dropdown.Item onClick={props.doLogOut}>
					<span className='pr-2'>Logout</span>
					<BoxArrowRight size={24} className="pb-1"/>
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}

export { MyNavbar };