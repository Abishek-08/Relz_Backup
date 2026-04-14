import * as React from "react";
import clsx from "clsx";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
import SkillAssessmentBatchReport from "./SkillAssessmentBatchReport";
import KnowledgeAssessmentBatchReport from "./KnowledgeAssessmentBatchReport";
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { useEffect, useState } from "react";
import { getAllBatch } from "../../../services/admin_module_services/BatchService";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import OverAllBatchPerformanceGraph from "./OverAllBatchPerformanceGraph";
import SkillBatchwiseUserReport from "./SkillBatchwiseUserReport";

/**
 * @author ranjitha.rajaram
 * @version 5.0
 * @since 26/07/2024
 * @returns 
 */
function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "warning.main",
        display: "inline-block",
        verticalAlign: "middle",
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color:
    theme.palette.mode === "light"
      ? theme.palette.grey[800]
      : theme.palette.grey[400],
  position: "relative",
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: "row-reverse",
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`&.Mui-expanded `]: {
    "&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.primary.main
          : theme.palette.primary.dark,
    },
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      left: "16px",
      top: "44px",
      height: "calc(100% - 48px)",
      width: "1.5px",
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
    },
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color:
      theme.palette.mode === "light" ? theme.palette.primary.main : "white",
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
  color: "inherit",
  fontFamily: "General Sans",
  fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: "1.2rem" }}
        />
      )}

      <StyledTreeItemLabelText variant="body2">
        {children}
      </StyledTreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItem2Label>
  );
}

const isExpandable = (reactChildren) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileType = (fileType) => {
  switch (fileType) {
    case "image":
      return ImageIcon;
    case "pdf":
      return PictureAsPdfIcon;
    case "doc":
      return AssessmentIcon;
    case "video":
      return VideoCameraBackIcon;
    case "folder":
      return GroupsRoundedIcon;
    case "pinned":
      return FolderOpenIcon;
    case "trash":
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children, onComponentChange, ...other },
  ref
) {
  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);
  let icon;

  if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
  } else {
    icon = GroupsRoundedIcon; // Default icon if no fileType specified
  }

//   const handleItemClick = async () => {
//     const batchIds = itemId.split(".");
//     const batchId = batchIds[0];
//     sessionStorage.setItem("batchId", batchId);

//     if (label === "Skill Assessment") {
//       try {
//         onComponentChange(<SkillAssessmentBatchReport batchId={batchId} />);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     } else if (label === "Knowledge Assessment") {
//       try {
//         onComponentChange(<KnowledgeAssessmentBatchReport batchId={batchId} />);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     } else if (label === "Knowledge Assessment") {
//       try {
//         onComponentChange(<SkillBatchwiseUserReport/>);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     } 
    
//   };

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx("content", {
              "Mui-expanded": status.expanded,
              "Mui-selected": status.selected,
              "Mui-focused": status.focused,
              "Mui-disabled": status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon,
              expandable: expandable && status.expanded,
            //   onClick: handleItemClick, // Pass click handler to CustomLabel
            })}
          />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

export default function TreeViewStructure() {
  const [batchData, setBatchData] = useState([]);
  const [ITEMS, setItems] = useState([]); // Define ITEMS state
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllBatch();
      const batches = response.data;

      // Transform batch data into ITEMS format
      const ITEMS = batches.map((batch) => ({
        id: batch.batchId.toString(), // Ensure id is string
        label: batch.batchName,
        children: [
          {
            id: `${batch.batchId}.1`,
            label: "Skill Assessment",
            fileType: "doc",
          },
          {
            id: `${batch.batchId}.2`,
            label: "Knowledge Assessment",
            fileType: "doc",
          },
        ],
      }));

      setBatchData(batches); // Store batch data in state
      setItems(ITEMS); // Set ITEMS state
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  // Define a handler function for updating selected component
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div
      className="container-fluid "
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        padding: "50px",
        paddingRight:"13px",
        paddingBottom:"50px",
        marginTop:"20px",
        paddingLeft:"12px",
        // marginLeft:"40px",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          overflow: "hidden",
        //   gap: "10px",
        }}
      >
        <div
          style={{
            flexBasis: "220px",
            flexShrink: 0,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflowY: "auto",
            padding: "30px",
          }}
        >
          <RichTreeView
            items={ITEMS}
            defaultExpandedItems={ITEMS.map(item => item.id)}
            sx={{ maxWidth: "100%" }}
            slots={{
              item: (props) => (
                <CustomTreeItem
                  {...props}
                  onComponentChange={handleComponentChange}
                />
              ),
            }}
          />
        </div>
       
      </div>
    </div>
  );
}
