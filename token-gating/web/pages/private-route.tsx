import { Grid } from '@chakra-ui/react'
import { withAuthSync } from '@utils/authUtils'
import { FC } from 'react'

const PrivateRoute: FC = () => (
  <Grid placeContent="center" h="100vh">
    This is a private route
  </Grid>
)

export default withAuthSync(PrivateRoute)
