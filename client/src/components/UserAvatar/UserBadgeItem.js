import React from 'react'
import{Badge} from "@chakra-ui/react"
import { CloseIcon } from '@chakra-ui/icons'
const UserBadgeItem = ({ user, handleFunction}) => {
  return (
      <Badge
          px={2}
          py={1}
          borderRadius={"lg"}
          m={1}
          mb={2}
          fontSize={12}
          cursor={'pointer'}
          onClick={handleFunction}
      >
          {user.name}
          <CloseIcon pl={1}/>
          
    </Badge>
  )
}

export default UserBadgeItem