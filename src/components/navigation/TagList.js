import React from 'react'
import Tag from './Tag'

export default (({ tags, textResolver, titleResolver, classNameResolver, icon }) => (
  <div className="tag-list">
    <ul className="list-inline">
      {tags && tags.map((tag, index) => <li key={index}
          title={titleResolver ? titleResolver(tag) : ""}
          className={classNameResolver ? classNameResolver(tag) : ""}>
        <Tag icon={icon ? icon : "tag"} text={textResolver ? textResolver(tag) : tag.Tag.Value} />
      </li>)}
    </ul>
  </div>
))