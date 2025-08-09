import React, {useState, useEffect} from 'react';
import { Form, OverlayTrigger, Popover, Table,
    Badge, Button, Spinner } from 'react-bootstrap';

const initialState = {
    Label1: "",
    Label2: "",
    Label3: "",
    Label4: "",
    Label5: "",
}

function LabelsOverlay(props) {

    const [formData, setFormData] = useState(initialState);

    useEffect(()=>{
        setFormData({
            ...initialState,
            Label1: props.Labels? props.Labels.Label1: "",
            Label2: props.Labels? props.Labels.Label2: "",
            Label3: props.Labels? props.Labels.Label3: "",
            Label4: props.Labels? props.Labels.Label4: "",
            Label5: props.Labels? props.Labels.Label5: "",
        })
    },[props.Labels])

    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Labels</Popover.Title>
            <Popover.Content>
                <Table size="sm" responsive="sm">
                      <tbody>
                      {
                        props.Labels && Object.keys(props.Labels).map(
                          key => {
                            return(
                            <tr key={key}>
                              <td>{`Label ${key.substring(5,6)}: `}</td>
                              <td>
                                {
                                    props.readOnly ? props.Labels[key] :
                                    <Form.Control size="sm" type="input" maxLength={20} 
                                    name={key} value={formData[key]?formData[key]:""} 
                                    onChange={(e)=>setFormData({...formData, [key]:e.target.value})}/>
                                }
                              </td>
                            </tr>
                            )
                          }
                        )
                      }
                      </tbody>
                      <tfoot>
                        {
                            !props.readOnly && 
                            <tr>
                            <td colSpan={2}>
                                <Button variant="primary" block size="sm" 
                                    onClick={()=>props.onSaveLabels(formData)}>
                                    {
                                        props.isLoading?
                                        <Spinner as="span" animation="border" size="sm" role="status"
                                        aria-hidden="true"/> : 'Save'
                                    }
                                </Button>
                            </td>
                            </tr>
                        }
                      </tfoot>
                </Table>
            </Popover.Content>
        </Popover>  
    );              

    return (
        <OverlayTrigger placement="auto" overlay={popover} trigger={props.readOnly?['hover','focus']:"click"}>
            <Badge variant="light">
                Labels
            </Badge>
        </OverlayTrigger>
    );
}

export default LabelsOverlay;