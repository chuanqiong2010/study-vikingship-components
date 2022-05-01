import {
  FC,
  createContext,
  useState,
  Children,
  FunctionComponentElement,
  cloneElement,
} from 'react';
import classNames from 'classnames';
import { IMenuContext, MenuItemProps, MenuProps } from './types';

const MenuContext = createContext<IMenuContext>({ index: 0 });

const Menu: FC<MenuProps> = (props) => {
  const { className, mode, style, children, defaultIndex, onSelect } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  const classes = classNames('menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical',
  });
  const handleClick = (index: number) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : 0,
    onSelect: handleClick,
  };
  const renderChildren = () => {
    return Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      const {
        type: { displayName },
        props,
      } = childElement;

      if (displayName === 'MenuItem') {
        return cloneElement(childElement, { index: props.index || i });
      } else {
        console.error(
          'Warning: Menu has a child which is not a MenuItem component'
        );
      }
    });
  };
  return (
    <ul className={classes} style={style} role="menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: 0,
  mode: 'horizontal',
};

export { MenuContext as MenuContenxt };
export default Menu;
