import styled from 'styled-components';

export const Input = styled.input`
	height: 37px;
	border-radius: 5px;
	border: none;
	text-align: center;
	font-size: 15px;
`

export const Page = styled.div`
	font-size: 16px;
	height: 100vh;
	display: flex;
`

export const Sidebar = styled.div`
	flex: 0 0 25%;
	background: #f1f1f1;
	padding: 0px 6px;
	display: flex;
	flex-direction: column;
`

export const SidebarHeader = styled.div`
	justify-content: space-between;
	display: flex;
	align-items: center;
`

export const SidebarContent = styled.div`
	margin: 6px;
	overflow-y: scroll;
`

export const SidebarContentHeader = styled.div`
	justify-content: space-around;
	display: flex;
`

export const ExcludedDate = styled.div`
	display: flex;
	background: #ddd;
	padding: 12px;
	margin: 6px 0px;
	justify-content: space-between;
`

export const Main = styled.div`
	flex: 1 1 75%;
	background: #7986cb;
	color: #ECEFF1;
	display: flex;
	flex-direction: column;
`

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	height: 50%;
`

export const Control = styled.div`
	display: flex;
	align-items: center;
`

export const Result = styled.div`
	display: flex;
	height: 100px;
	align-items: center;
	justify-content: center;
`

export const ResultContent = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: center;
  justify-content: space-evenly;
`

export const Date = styled.div`
	font-weight: bold;
	text-align: center;
`

export const Title = styled.div`
	height: 50%;
	padding: 20px;
	font-size: 24px;
`
