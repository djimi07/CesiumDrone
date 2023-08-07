import * as Menubar from '@radix-ui/react-menubar';
//import { ChevronRightIcon} from '@radix-ui/react-icons';
//import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';

function MenuBar(props:any)
{

    //const [selectedLayer, setSelectedLayer] = useState<any>();

    function changeImagery(imagery:string)
    {
        props.setSelectedImagery(imagery)
    }

    return <Menubar.Root className="MenubarRoot menu_bar">

      <Menubar.Menu>
        <Menubar.Trigger className="MenubarTrigger title_button">Imagery layers</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content className="MenubarContent" align="start" sideOffset={5} alignOffset={-3}>
            {props.imageryList.map((imagery:string, i:number) => {
                return <Menubar.Item key={i} onClick={()=>props.addImagery()} className={"MenubarItem item_title " + ((props.ImageryLayer == imagery) ? 'selected' : '')}>
                    {imagery}
                </Menubar.Item>
            })}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      </Menubar.Root>
  

}

export default MenuBar;
