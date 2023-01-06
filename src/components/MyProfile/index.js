import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import Profile from '../Profile'

const myPosts = [
  {
    image:
      'https://res.cloudinary.com/dfsytkmik/image/upload/v1672798663/Insta%20Share%20Project/DSC_0437_jaehar.jpg',
  },
  {
    image:
      'https://res.cloudinary.com/dfsytkmik/image/upload/v1672798601/Insta%20Share%20Project/DSC_0222_nknrkv.jpg',
  },
  {
    image:
      'https://res.cloudinary.com/dfsytkmik/image/upload/v1672990286/Insta%20Share%20Project/IMG20220120195204_fwgaxs.jpg',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {myProfileData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getMyProfile()
  }

  getMyProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }

    const getFormattedData = data => ({
      posts: myPosts,
      stories: data.stories,
      followersCount: data.followers_count,
      followingCount: data.following_count,
      id: data.id,
      postsCount: data.posts_count,
      profilePic:
        'https://res.cloudinary.com/dfsytkmik/image/upload/v1672798161/Insta%20Share%20Project/.trashed-1652869088-IMG20220208174232_u83sc5.jpg',
      userBio: 'Frontend Developer',
      userId: 'Linga Reddy',
      userName: 'Lingareddy3419',
    })

    const response = await fetch(url, options)

    const fetchedData = await response.json()

    if (response.ok) {
      const myProfile = fetchedData.profile
      const updatedMyProfile = getFormattedData(myProfile)
      this.setState({
        myProfileData: updatedMyProfile,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMyProfileView = () => {
    const {myProfileData} = this.state
    return <Profile profileDetails={myProfileData} owner="my" />
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div
        className="user-profile-loader-container"
        // eslint-disable-next-line react/no-unknown-property
        testid="loader"
      >
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="user-profile-loader-container">
        <img
          className="user-profile-error-image"
          alt="failure view"
          src="https://res.cloudinary.com/aneesmon/image/upload/v1648988134/Insta_Share/failure-image_hzoet8.png"
        />
        <p className="user-profile-error-message">
          Something went wrong. Please try again
        </p>
        <button
          className="user-profile-error-button"
          type="button"
          onClick={this.getMyProfile}
        >
          Try again
        </button>
      </div>
    </>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderMyProfileView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default MyProfile
