import React from 'react'
import {Field, reduxForm} from 'redux-form'


let SearchForm = props => {
  const {handleSubmit} = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="trackSearch">Search by Track Id</label>
        <Field name="trackSearch" component="input" type="text" />
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

SearchForm = reduxForm({
  // a unique name for the form
  form: 'search'
})(SearchForm)

export default SearchForm
