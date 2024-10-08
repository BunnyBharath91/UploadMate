import { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  RequestCard,
  RequestThumbnail,
  RequestTextContainer,
  VideoTitle,
  CreatorId,
  Id,
  StatusAndButtonsContainer,
  RequestStatus,
  Status,
  ButtonsContainer,
  Button,
  VideoUploadedText,
  RequestedDateTime,
  LargeScreenRequestStatus,
  ResponseDateTime,
  ExtraLargeScreenUploadButtonContainer,
  LargeScreenDeleteButtonContainer,
} from "./styledComponents";
import { Oval } from "react-loader-spinner";

class EditorSectionRequestCard extends Component {
  state = {
    isUploadOrResendProcessing: false,
    isDeleteProcessing: false,
  };

  handleUpload = async (event) => {
    const { uploadVideo, requestDetails, activeLanguage } = this.props;
    const { videoId } = requestDetails;

    event.stopPropagation(); // Prevent event from bubbling up
    this.setState({ isUploadOrResendProcessing: true });

    try {
      await uploadVideo(activeLanguage, videoId);
    } finally {
      this.setState({ isUploadOrResendProcessing: false });
    }
  };

  handleDelete = async (event) => {
    const { deleteRequest, requestDetails } = this.props;
    const { videoId } = requestDetails;

    event.stopPropagation(); // Prevent event from bubbling up
    this.setState({ isDeleteProcessing: true });

    try {
      await deleteRequest(videoId);
    } finally {
      this.setState({ isDeleteProcessing: false });
    }
  };

  handleResendRequest = async (event) => {
    const { resendRequest, requestDetails } = this.props;
    const { videoId } = requestDetails;

    event.stopPropagation(); // Prevent event from bubbling up
    this.setState({ isUploadOrResendProcessing: true });

    try {
      await resendRequest(videoId);
    } finally {
      this.setState({ isUploadOrResendProcessing: false });
    }
  };

  render() {
    const { isDeleteProcessing, isUploadOrResendProcessing } = this.state;
    const { requestDetails, requestContent, fsr } = this.props;

    const {
      videoId,
      requestStatus,
      toUser,
      title,
      thumbnailUrl,
      videoUploadStatus,
      requestedDateTime,
      responseDateTime,
    } = requestDetails;

    const requestedDate = requestedDateTime.slice(0, 10);
    const requestedTime = requestedDateTime.slice(11);

    let responseDate, responseTime;
    if (responseDateTime) {
      responseDate = responseDateTime.slice(0, 10);
      responseTime = responseDateTime.slice(11, 19);
    }

    const {
      to,
      requestStatus_,
      approved,
      pending,
      rejected,
      upload,
      resend,
      delete_,
      videoUploaded,
    } = requestContent;

    return (
      <RequestCard
        key={videoId}
        onClick={
          isUploadOrResendProcessing || isDeleteProcessing
            ? undefined
            : () => this.props.history.push(`/editor_section/${videoId}`)
        }
      >
        <RequestThumbnail alt="thumbnail" src={thumbnailUrl} loading="lazy" />
        <RequestTextContainer className="request-card-text-container">
          <VideoTitle ratio={fsr}>{title}</VideoTitle>
          <CreatorId ratio={fsr}>
            {to}: <Id>{toUser}</Id>
          </CreatorId>
          <StatusAndButtonsContainer>
            <RequestStatus ratio={fsr}>
              {requestStatus_}:{" "}
              <Status>
                {requestStatus === "approved"
                  ? approved
                  : requestStatus === "pending"
                  ? pending
                  : rejected}
              </Status>
            </RequestStatus>

            <ButtonsContainer className="request-card-buttons-container">
              {requestStatus === "approved" &&
                (responseDateTime ? (
                  videoUploadStatus === "not uploaded" && (
                    <Button
                      onClick={this.handleUpload}
                      disabled={
                        isUploadOrResendProcessing || isDeleteProcessing
                      }
                      isProcessing={
                        isUploadOrResendProcessing || isDeleteProcessing
                      }
                    >
                      {upload}
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={this.handleResendRequest}
                    disabled={isUploadOrResendProcessing || isDeleteProcessing}
                    isProcessing={
                      isUploadOrResendProcessing || isDeleteProcessing
                    }
                  >
                    {isUploadOrResendProcessing ? (
                      <Oval
                        color="var(--primary-color)"
                        height="17"
                        width="17"
                      />
                    ) : (
                      resend
                    )}
                  </Button>
                ))}

              {videoUploadStatus === "uploaded" && (
                <VideoUploadedText className="video-uploaded-text" ratio={fsr}>
                  {videoUploaded}
                </VideoUploadedText>
              )}
              {videoUploadStatus === "not uploaded" &&
                requestStatus !== "pending" && (
                  <Button
                    onClick={this.handleDelete}
                    delete
                    disabled={isUploadOrResendProcessing || isDeleteProcessing}
                    isProcessing={
                      isUploadOrResendProcessing || isDeleteProcessing
                    }
                  >
                    {isDeleteProcessing ? (
                      <Oval
                        color="var(--secondary-color)"
                        height="17"
                        width="17"
                      />
                    ) : (
                      delete_
                    )}
                  </Button>
                )}
            </ButtonsContainer>
          </StatusAndButtonsContainer>
        </RequestTextContainer>
        <RequestedDateTime ratio={fsr}>
          <span>{requestedDate}</span>
          <span>{requestedTime}</span>
        </RequestedDateTime>
        <LargeScreenRequestStatus ratio={fsr}>
          {requestStatus === "approved"
            ? approved
            : requestStatus === "pending"
            ? pending
            : rejected}
        </LargeScreenRequestStatus>
        {responseDateTime ? (
          <ResponseDateTime ratio={fsr}>
            <span>{responseDate}</span>
            <span>{responseTime}</span>
          </ResponseDateTime>
        ) : (
          <ResponseDateTime>{"-"}</ResponseDateTime>
        )}
        <ExtraLargeScreenUploadButtonContainer>
          {requestStatus === "approved" ? (
            responseDateTime ? (
              videoUploadStatus === "not uploaded" ? (
                <Button
                  onClick={this.handleUpload}
                  disabled={isUploadOrResendProcessing || isDeleteProcessing}
                  isProcessing={
                    isUploadOrResendProcessing || isDeleteProcessing
                  }
                >
                  {upload}
                </Button>
              ) : (
                "-"
              )
            ) : (
              <Button
                onClick={this.handleResendRequest}
                disabled={
                  isUploadOrResendProcessing || isUploadOrResendProcessing
                }
                isProcessing={isUploadOrResendProcessing || isDeleteProcessing}
              >
                {isUploadOrResendProcessing ? (
                  <Oval color="var(--primary-color)" height="17" width="17" />
                ) : (
                  resend
                )}
              </Button>
            )
          ) : (
            "-"
          )}
        </ExtraLargeScreenUploadButtonContainer>
        <LargeScreenDeleteButtonContainer>
          {videoUploadStatus === "not uploaded" &&
          requestStatus !== "pending" ? (
            <Button
              onClick={this.handleDelete}
              delete
              disabled={isUploadOrResendProcessing || isDeleteProcessing}
              isProcessing={isUploadOrResendProcessing || isDeleteProcessing}
            >
              {isDeleteProcessing ? (
                <Oval color="var(--secondary-color)" height="17" width="17" />
              ) : (
                delete_
              )}
            </Button>
          ) : (
            "-"
          )}
        </LargeScreenDeleteButtonContainer>
      </RequestCard>
    );
  }
}

export default withRouter(EditorSectionRequestCard);
